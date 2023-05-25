require('dotenv').config();
const axios = require('axios');

const togglApiToken = process.env.TOGGL_API_TOKEN;
const togglApiUrl = 'https://api.track.toggl.com/api/v8/time_entries';
const togglProjectId = process.env.TOGGL_PROJECT_ID;

const createTogglTimeEntry = async (description, pid, startDateTime, duration) => {
    const data = {
        time_entry: {
            description: description,
            duration: duration,
            start: startDateTime,
            pid: pid, 
            created_with: 'The Eye Of Shmoggl',
        },
    };

    const config = {
        auth: {
            username: togglApiToken,
            password: 'api_token',
        },
    };

    try {
        const response = await axios.post(togglApiUrl, data, config);
        console.log('Time entry created successfully:', response.data);
    } catch (error) {
        console.log('Error creating time entry:', error);
    }
};


const createTimeBlock = async (description, projectId, startDate, hours) => {

    createTogglTimeEntry(description, projectId, startDate, hours * 3600);
};


const createDefaultWorkday = async (description, projectId, dayStr) => {

    //Creates a default workday. 3 hours. 9-12. Break 12-1. 4 hours. 1-5.
    const startDateTime = new Date(dayStr);

    startDateTime.setHours(9, 0);
    createTimeBlock(description, projectId, startDateTime, 3);
    
    startDateTime.setHours(13, 0);
    createTimeBlock(description, projectId, startDateTime, 4);
};

//createDefaultWorkday("Test", togglProjectId, '05/25/2023');

const createDefaultWorkWeek = async (description, projectId, anyDayInWeek) => {

    createDefaultWorkday(description, projectId, '05/25/2023');
    createDefaultWorkday(description, projectId, '05/25/2023');
    createDefaultWorkday(description, projectId, '05/25/2023');
    createDefaultWorkday(description, projectId, '05/25/2023');
    createDefaultWorkday(description, projectId, '05/25/2023');
};