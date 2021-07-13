// const puppeteer = require("puppeteer");
module.exports = {
	name: 'code-to-image',
    type: 'fun',
    usage: '&{prefix}code-to-image <code>',
    description: 'converts the code into an image',
    aliases: ["cti"],
    permissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
    async execute(message, args, bot, Discord, prefix) {
	        if (message.author.id != "451693463742840842")
	    	return message.channel.send("Under development...");
		message.channel.send("Generating image");
		//let text =  args.join(" ").match(/```[^```]+```|[\\S]+```[^```]+/);
		/*if (text) {
			text = text[0].trim();
			text = text.replace(/^```|```$|\n```$/g, "")
			let space = text.indexOf(/ /)
			let newLine = text.indexOf(/\n/)
			if (space > newLine || space == -1 && newLine != -1)
				text = text.split("\n").slice(1).join("\n").trim();
      		}*/
	        let text = args.join(" ");
		if (!text)
			text = `Please type the code with the command
Example: 
%code-to-image let hi = "hi";
console.log(hi);`
// 		const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
//         	const page = await browser.newPage();
//         	await page.goto('https://carbon.now.sh');
//         	for (let i = 1; i<=16; i++)
//             		await page.keyboard.press('Tab');    
//         	await page.keyboard.down('Control');
//         	await page.keyboard.press('a');
//         	await page.keyboard.up('Control');
//         	await page.keyboard.press("Backspace");
//         	await page.keyboard.type(text);
// 		await page.click('.settings-container')
// 		await page.click('.preset-container')
// 		for (let i = 1; i<=2; i++)
// 			await page.keyboard.press("Tab");
// 		await page.keyboard.press("Enter");
// 		await page.click(".settings-container");
// 		const handler = await page.$('.handler');
// 		const bounding_box = await handler.boundingBox();
// 
// 		await page.mouse.move(bounding_box.x + bounding_box.width / 2, bounding_box.y + bounding_box.height / 2);
// 		await page.mouse.down();
// 		await page.mouse.move(bounding_box.x+bounding_box.width/2+10, bounding_box.y+bounding_box.height/2+10);
// 		await page.mouse.up();
// 		await page.click("h2.mt3")
//         	const logo = await page.$('[id="export-container"]');        // logo is the element you want to capture
//         	let x = await logo.screenshot();
//         	await browser.close();
        const createCTI = codeSnippet => {
            let y = codeSnippet.replace(/ /g,"%20").replace(/\n/g,"%250a");
            const burl = `https://carbonnowsh.herokuapp.com/?code=${y}`;
            return burl
        }
        message.channel.send(new Discord.MessageAttachment(createCTI(text), "code.png"));
	}
}
