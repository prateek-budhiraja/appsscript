// fetch email id and send mail
async function sendReminders() {
	const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("email");
	var values = sheet.getDataRange().getValues();
	const { title, purport, devanagari, translation, chapter, verse } =
		await generateBodyContent();
	let resultPurport = "";
	for (let p = 0; p < purport.length; p++) {
		resultPurport += `<p style='text-align:center'>${purport[p]}</p><br/>`;
	}
	for (let i = 0; i < 1; i++) {
		try {
			MailApp.sendEmail({
				to: `${values[i]}`,
				subject: `Your Spiritual digest for ${getTodayDate()} is here! 🧘`,
				htmlBody: `
        <!DOCTYPE html>
        <html lang="en">

        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email</title>
          <style>
            * {
              text-align: center;
              font-family: arial, helvetica, sans-serif
            }

            body {
              padding: 20px 10px;
              background-color: #f6f6f2
            }

            .container {
              max-width: 500px;
              margin: 0 auto;
            }

            img {
              width: 100%;
            }

            hr {
              color: #6fb3b8;
            }

            h1 {
              margin: 20px 0;
              color: #6fb3b8;
              text-decoration: underline;
              font-size: 24px
            }

            h2 {
              margin: 20px 0;
              color: #6fb3b8;
              font-size: 22px
            }

            p {
              line-height: 140%;
              font-size: 18px;
            }

            button {
              cursor: pointer;
              padding: 12px 28px;
              border: 0px;
              background-color: #6fb3b8;
              border-radius: 28px;
              color: #f6f6f2;
            }
             @media (max-width: 480px) {
               p {
                 font-size: 16px;
                 text-align: justify;
               }
              }
          </style>
        </head>

        <body>
          <div class="container">
            <img src="https://static.sadhguru.org/d/46272/1633188454-1633188453427.jpg" alt="" srcset="">
            <h1>${title}</h1>
            <h3>${devanagari}</h3>
            <hr />
            <h2>Translation</h2>
            <p>${translation}</p>
            <hr />
            <h2>Purport</h2>
            <p>${resultPurport}</p>
            <a href="https://vedabase.io/en/library/bg/${chapter}/${verse}/"><button>Source</button></a>
          </div>
        </body>

        </html>
        `,
			});
		} catch (err) {
			console.log(err);
		}
	}
	console.log(MailApp.getRemainingDailyQuota());
}

// call api to fetch and return BG verse object
async function generateBodyContent() {
	let result = await UrlFetchApp.fetch(
		"https://bhagavadgita-api.onrender.com/v1/bg"
	);
	return JSON.parse(result).verse[0];
}

// util function to return date in MMM DD, YYYY format
function getTodayDate() {
	const todayDate = new Date();
	let month = "";
	switch (todayDate.getMonth()) {
		case 0:
			month = "Jan";
			break;
		case 1:
			month = "Feb";
			break;
		case 2:
			month = "March";
			break;
		case 3:
			month = "April";
			break;
		case 4:
			month = "May";
			break;
		case 5:
			month = "June";
			break;
		case 6:
			month = "July";
			break;
		case 7:
			month = "Aug";
			break;
		case 8:
			month = "Sep";
			break;
		case 9:
			month = "Oct";
			break;
		case 10:
			month = "Nov";
			break;
		case 11:
			month = "Dec";
			break;
		default:
			month = "NULL";
	}
	return `${month} ${todayDate.getDate()}, ${todayDate.getFullYear()}`;
}

// Trigger sendReminders function everyday at 6am
ScriptApp.newTrigger("sendReminders")
	.timeBased()
	.atHour(6)
	.everyDays(1)
	.create();
