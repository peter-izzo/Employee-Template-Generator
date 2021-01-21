const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

 

const OUTPUT_DIR = path.resolve(__dirname, "output");

const outputPath = path.join(OUTPUT_DIR, "team.html");

//Regex to validate whether someones email is valid or not
const emailValidator = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const render = require("./lib/htmlRenderer");

 

var teamList = [];

 

const employeeQuestions = [

    {

        type: 'input',

        message: 'Name:',

        name: 'name'

    },

    {

        type: 'input',

        message: "ID:",

        name: 'id'

    },

    {

        type: 'input',

        message: 'Email:',

        name: 'email',
        validate: async (input) => {
            if (emailValidator.test(input)) {
                return true;
            } 
            return "Please enter a valid email address."
        }

    },

    {

        type: "list",

        name: "role",

        message: "What is the employee's role?",

        choices: ["engineer", "intern", "manager"]

    },

    {

        when: input => {

            return input.role == "manager"

        },

        type: "input",

        name: "officeNum",

        message: "Enter office number: ",

        validate: async (input) => {

            if(isNaN(input)) {

                return "Please enter a valid office number.";

            }

            return true;

        }

    },

    {

        when: input => {

            return input.role == "engineer"

        },

        type: "input",

        name: "github",

        message: "Please enter your github username: ",

        validate: async(input) => {

            if(input == "" || /\s/.test(input)) {

                return "Please enter a valid Github username.";

            }

            return true;

        }

    },

    {

        when: input => {

            return input.role == "intern"

        },

        type: "input",

        name: "school",

        message: "Please enter your school's name: ",

        validate: async(input) => {

            if(input == "") {

                return "Please enter a valid schol name.";

            }

            return true;

        }

    },

    {

        type: "list",

        name: "addMore",

        message: "Add another team member?",

        choices: ["Yes", "No"]

    }

];


function askQuestions(question) {

    return inquirer.prompt(question)

};


async function buildTeam() {

    let finished = false;

    while(!finished) {

        let ques = await askQuestions(employeeQuestions);

        if(ques.role == "manager") {

            let newMember = new Manager(ques.name, ques.id, ques.email, ques.officeNum);

            teamList.push(newMember);

        } else if(ques.role == "engineer") {

            let newMember = new Engineer(ques.name, ques.id, ques.email, ques.github);

            teamList.push(newMember);

        } else if (ques.role == "intern"){

            let newMember = new Intern(ques.name, ques.id, ques.email, ques.school);

            teamList.push(newMember);

        }

        if (ques.addMore === "Yes"){

            console.log("------------");

            console.log(teamList);

        } else{

            finished = true

        }

    }
    return teamList;

};


 

async function init() {

    let teamList = await buildTeam();

    let html = await render(teamList);

    if(!fs.existsSync(OUTPUT_DIR)){

        fs.mkdirSync(OUTPUT_DIR);

        fs.writeFile(outputPath, html, () => {

            console.log('Created directory "output" and wrote to file "team.html"');

        });

    } else {

        fs.writeFile(outputPath, html, () => {

            console.log('Wrote to file "team.html"');

        });

    }

};

 

init();

// Write code to use inquirer to gather information about the development team members,

// and to create objects for each team member (using the correct classes as blueprints!)

 

// After the user has input all employees desired, call the `render` function (required

// above) and pass in an array containing all employee objects; the `render` function will

// generate and return a block of HTML including templated divs for each employee!

 

// After you have your html, you're now ready to create an HTML file using the HTML

// returned from the `render` function. Now write it to a file named `team.html` in the

// `output` folder. You can use the variable `outputPath` above target this location.

// Hint: you may need to check if the `output` folder exists and create it if it

// does not.

 

// HINT: each employee type (manager, engineer, or intern) has slightly different

// information; write your code to ask different questions via inquirer depending on

// employee type.

 

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,

// and Intern classes should all extend from a class named Employee; see the directions

// for further information. Be sure to test out each class and verify it generates an

// object with the correct structure and methods. This structure will be crucial in order

// for the provided `render` function to work! ```