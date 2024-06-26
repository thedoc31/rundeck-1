/*
 * Copyright 2016 SimplifyOps, Inc. (http://simplifyops.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package rundeck.services

import com.dtolabs.rundeck.core.jobs.JobReference

/**
 * Created by greg on 2/3/15.
 */
class JobReferenceImpl implements JobReference {
    String id
    String project
    String jobName
    String groupPath
    String serverUUID
    String originalQuartzJobName
    String originalQuartzGroupName

    @Override
    String getJobAndGroup() {
        null != groupPath ? groupPath + '/' + jobName : jobName
    }

    @Override
    public String toString() {
        return "JobReference{" +
                "id='" + id + '\'' +
                ", project='" + project + '\'' +
                ", jobName='" + jobName + '\'' +
                ", groupPath='" + groupPath + '\'' +
                '}';
    }
}
