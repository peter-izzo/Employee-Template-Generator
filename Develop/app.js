const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const emailValidator = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const render = require("./lib/htmlRenderer");

var teamList = [];
const managers = [];
const engineers = [];
const interns = [];

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
        name: 'email'
    }
];

const special = [
    'manager': {
        type: 'input',
        message: 'Enter your Office Number:',
        name: 'special'
    },
    'engineer': {
        type: 'input',
        message: 'Enter your GitHub Username:',
        name: 'special'
    },
    'intern': {
        type: 'input',
        message: 'Enter your school:',
        name: 'special'
    }
];

const type = {
    type: 'rawlist',
    message: 'Enter employee type:',
    name: 'type',
    choices: ['manager','engineer','intern','none']
}

const typeClass = {
    'manager': Manager,
    'engineer': Engineer,
    'intern': Intern
}

//as cool as this was...it didn't work
const managerQuestions = [
    {
        type: "input",
        name: "name",
        message: "Enter manager's name: ",
        validate: async (input) => {
            if(input == "" || /\s/.test(input)) {
                return "Please enter a valid first or last name.";
            }
            return true;
        }
    },
    {
        type: "input",
        name: "email",
        message: "Enter manager's email: ",
        validate: async (input) => {
            if(emailValidator.test(input)) {
                return true;
            }
            return "Please enter a valid email.";
        }
    },
    {
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
        type: "list",
        name: "hasEmployees",
        message: "Does the manager have any employees? ",
        choices: ["Yes", "No"]
    }
];

/*same
const employeeQuestions = [
    {
        type: "input",
        name: "name",
        message: "Please enter employee name: ",
        validate: async (input) => {
            if (input == "") {
                return  "Please enter a valid name";
            }
            return true;
        }
    },
    {
        type: "input",
        name: "email",
        message: "Please enter employee email: ",
        validate: async (input) => {
            if (emailValidator.test(input)) {
                return  true;
            }
            return "Please enter a valid email";
        }
    },
    {
        type: "list",
        name: "role",
        message: "What is the employee's role?",
        choices: ["engineer", "intern"]
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
*/

//This kinda works
async function buildTeam() {
    inquirer.prompt(employeeQuestions).then(employeeInfo => {
        if (employeeInfo.role == "engineer") {
            var newMember = new Engineer(employeeInfo.name, teamList.length + 1, employeeInfo.email, employeeInfo.github);
            engineers.push(newMember);
        } if (employeeInfo.role == "intern"){
            var newMember = new Intern(employeeInfo.name, teamList + 1, employeeInfo.email, employeeInfo.school);
            interns.push(newMember);
        } if (employeeInfo.role == "manager"){
            var newMember = new Manager(employeeInfo.name, teamList + 1, employeeInfo.email, employeeInfo.school);
            managers.push(newMember);
        }
        teamList.push(newMember);
        if (employeeInfo.addMore === "Yes") {
            console.log("----------");
            console.log(teamList);
            buildTeam();
        } else {
            return teamList;
            //console.log(teamList);
        }
    })
};

/**
 * none of this worked. reworking everything
 
function buildPage() {
    let newFile = fs.readFileSync("./templates/main.html");
    fs.writeFileSync(outputPath, newFile, function (err) {
        if(err) throw err;
      })

      console.log("Page created");

      for(member of teamList) {
          if (member.getRole() == "Manager") {
              buildEmployeeCards("manager", member.getName(), member.getId(), member.getEmail(), "Office: " + member.getOfficeNumber());
          } else if (member.getRole() == "Engineer") {
            buildEmployeeCards("engineer", member.getName(), member.getId(), member.getEmail(), "Github: " + member.getGithub());
          } else if (member.getRole() == "Intern") {
            buildEmployeeCards("intern", member.getName(), member.getId(), member.getEmail(), "School: " + member.getSchool());
          }
      }
      fs.appendFileSync("./output/teamPage.html", "</div></main></body></html>", function (err) {
          if (err) throw err;
        });
    console.log("COMPLETE!");


};

function buildEmployeeCards(memberType, name, id, email, propertyValue) {
    let d = fs.readFileSync(`./templates/${memberType}.html`, 'utf8');
    d = d.replace("{{ name }}", name);
    d = d.replace("{{ id }}", `ID: ${id}`);
    d = d.replace("{{ email }}", `Email: <a href="mailto:${email}">${email}</a>`);
    d = d.replace("specialProperty", propertyValue);
    fs.appendFileSync("./output/teamPage.html", d, err => { if(err) throw err; })
}
*/

async function init() {
    //inquirteamLister.prompt(managerQuestions).then(managerInfo => {
        // let theManager = new Manager(managerInfo.name, 1, managerInfo.email, managerInfo.officeNumber);
        // .push(theManager);
    //     console.log("----------");
    //     console.log(teamList);
    //     if (managerInfo.hasEmployees) {
    //         buildTeam();
    //     } else {
    //         // render(teamList);
    //         console.log("finush this");
    //     }
    // })


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
