package rundeck.services.component

import com.dtolabs.rundeck.core.authorization.AuthContext
import com.dtolabs.rundeck.core.authorization.UserAndRolesAuthContext
import org.rundeck.app.components.RundeckJobDefinitionManager
import org.rundeck.app.components.jobs.JobDefinitionComponent
import org.springframework.context.ApplicationContextAware
import rundeck.JobHistory
import rundeck.ScheduledExecution

import java.text.DateFormat
import java.text.SimpleDateFormat

class JobHistoryService implements JobDefinitionComponent, ApplicationContextAware{

    RundeckJobDefinitionManager rundeckJobDefinitionManager
    static final String componentName = "JobHistory"
    static final String DATE_FORMAT = "yyyy-MM-dd HH:mm:ss"

    @Override
    String getName() {
        return componentName
    }

    @Override
    Map exportCanonicalMap(Map jobDataMap) {
        return null
    }

    @Override
    Map exportXMap(Map jobXMap) {
        return null
    }

    @Override
    Map importXMap(Map jobXMap, Map partialMap) {
        return null
    }

    @Override
    Object importCanonicalMap(Object job, Map jobDataMap) {
        return null
    }

    @Override
    Object updateJob(Object job, Object imported, Object associate, Map params) {
        return null
    }

    @Override
    void persist(Object job, Object associate, UserAndRolesAuthContext authContext) {

    }

    @Override
    void wasPersisted(Object job, Object associate, UserAndRolesAuthContext authContext) {
        saveJobHistory(job, authContext.getUsername())
    }

    @Override
    void willDeleteJob(Object job, AuthContext authContext) {

    }

    @Override
    void didDeleteJob(Object job, AuthContext authContext) {
        deleteJobHistory(job.uuid)
    }

    /**
     * It saves the job definition as yaml
     * @param scheduledExecution
     * @param user
     */
    void saveJobHistory(ScheduledExecution scheduledExecution, String user) {
        def jobDef = rundeckJobDefinitionManager.exportAsJson([scheduledExecution])
        JobHistory jh = new JobHistory()
        jh.userName = user
        jh.jobDefinition = jobDef
        jh.jobUuid = scheduledExecution.uuid
        jh.save()
    }

    /**
     * It removes the history when a job gets deleted
     * @param jobUuid
     */
    void deleteJobHistory(String jobUuid){
        JobHistory.executeUpdate("delete JobHistory jh where jh.jobUuid = :jobUuid", [jobUuid:jobUuid])
    }

    void deleteJobHistoryById(String historyId){
        JobHistory.findById(historyId.toInteger()).delete(flush:true)
    }

    /**
     * It retrieves all job histories and then parse the json stored in the DB to an actual ScheduledExecution
     * It adds the history parameters to the scheduledExecution so it can be shown in the request
     * @param jobUuid
     * @return
     */
    def getJobHistory(String jobUuid){
        def histories = []
        DateFormat dateFormat = new SimpleDateFormat(DATE_FORMAT)
        JobHistory.findAllByJobUuid(jobUuid, [order: "dateCreated"]).each {
            def scheduleDefs = rundeckJobDefinitionManager.decodeFormat("json", it.jobDefinition)
            scheduleDefs[0].job.modifierUserName = it.userName
            scheduleDefs[0].job.modifiedDate = dateFormat.format(it.dateCreated)
            scheduleDefs[0].job.historyId = it.id
            histories.add(scheduleDefs[0].job)
        }
        return histories
    }
}