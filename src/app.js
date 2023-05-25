require('dotenv').config();
const axios = require('axios');

const togglApiToken = process.env.TOGGL_API_TOKEN;
const togglApiUrl = 'https://api.track.toggl.com/api/v8/time_entries';
const togglProjectId = process.env.TOGGL_PROJECT_ID;

//Avoiding toggl API rate limiting
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};


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
        console.log('\nTime entry created successfully:', response.data);
    } catch (error) {
        if(error.response && error.response.status === 429) {
              //We have hit the rate limit... try again after waiting a few seconds
              console.log('\n=====! Hit rate limit. Waiting and trying again in 5 seconds !=====');
              await sleep(5000);
              await createTogglTimeEntry(description, pid, startDateTime, duration);
        }
        else{
            console.log('\nERROR creating time entry:', error);
        }
       
    }
};


const createTimeBlock = async (description, projectId, startDate, hours) => {

    await createTogglTimeEntry(description, projectId, startDate, hours * 3600);
};


// To use directly (run below all functions): 
// createDefaultWorkDay("My description", togglProjectId, '05/25/2023');
const createDefaultWorkDay = async (description, projectId, dayStr) => {

    //Creates a default workday. 3 hours. 9-12. Break 12-1. 4 hours. 1-5.
    const startDateTime = new Date(dayStr);

    
    startDateTime.setHours(9, 0);
    
    await createTimeBlock(description, projectId, startDateTime, 3);
    
    //pre-emptivley avoid rate limit
    await sleep(1000);

    startDateTime.setHours(13, 0);
    await createTimeBlock(description, projectId, startDateTime, 4);

     //pre-emptivley avoid rate limit
    await sleep(1000); 
};

// To use directly (run below all functions):
// createDefaultWorkWeek("Example description", togglProjectId, '05/15/2023');
const createDefaultWorkWeek = async (description, projectId, anyDayInWeek) => {
    // Create a new date object from the ISO string
    const date = new Date(anyDayInWeek);

    // Find the previous Monday or the current day if it is Monday
    while (date.getDay() !== 1) {
        date.setDate(date.getDate() - 1);
    }

    // Array of 5 workdays in a week, from Monday to Friday
    const workdays = [0, 1, 2, 3, 4];

    // For each workday, add the day to the date and call `createDefaultWorkday`
    for (const day of workdays) {
        const workday = new Date(date);
        workday.setDate(workday.getDate() + day);

        // Format the workday to a string in mm/dd/yyyy format
        const dayStr = `${workday.getMonth() + 1}/${workday.getDate()}/${workday.getFullYear()}`;
        
        await createDefaultWorkDay(description, projectId, dayStr);
    }
};

