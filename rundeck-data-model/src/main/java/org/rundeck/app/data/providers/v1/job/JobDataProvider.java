package org.rundeck.app.data.providers.v1.job;

import org.rundeck.app.data.model.v1.job.JobData;
import org.rundeck.spi.data.DataAccessException;

import java.io.Serializable;

public interface JobDataProvider {
    /**
     * Retrieves a Job based on the id provided.
     *
     * @param id of the Job, format Serializable
     * @return Job if found, otherwise null
     */
    JobData get(Serializable id);

    /**
     * Retrieves a Job based on the uuid provided.
     *
     * @param uuid of the Job, format String
     * @return Job if found, otherwise null
     */
    JobData findByUuid(String uuid);

    /**
     * Checks if the job exists in the database
     *
     * @param uuid of the Job, format String
     * @return boolean representing job existence
     */
    boolean existsByUuid(String uuid);

    /**
     * Save a Job with a generated id
     *
     * @param data Job attributes
     *
     * @return object of the created Job
     * @throws DataAccessException on error
     */
    JobData save(JobData data) throws DataAccessException;

    /**
     * Removes a Job
     *
     * @param id Job id
     * @throws DataAccessException on error
     */
    void delete(final Serializable id) throws DataAccessException;
}
