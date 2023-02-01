//* to format date for user info (username, date create) of blog post
//* require dayjs after installing in Node.js 
//* added dependency with NPM: 'npm install dayjs'
//* https://day.js.org/docs/en/installation/node-js

const dayjs = require('dayjs');

module.exports = {
    format_date: (date) => {
        // Format date as MM/DD/YYYY
        return date.toLocaleDateString();
    },
    //* to format time, will mostly format 'date_created' property of objects that contains time
    format_time: (time) => {
        return dayjs(time).format('h:mm A')
    },
    format_amount: (amount) => {
        // format large numbers with commas
        return parseInt(amount).toLocaleString();
    },
    get_emoji: () => {
        const randomNum = Math.random();

        // Return a random emoji
        if (randomNum > 0.7) {
            return `<span for="img" aria-label="lightbulb">🐴💡</span>`;
        } else if (randomNum > 0.4) {
            return `<span for="img" aria-label="laptop">🐎💻</span>`;
        } else {
            return `<span for="img" aria-label="gear">⚙️🎠</span>`;
        }
    },
};
