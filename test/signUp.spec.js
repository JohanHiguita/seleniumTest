// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const md5 = require('md5');
const { doesNotMatch } = require('assert');

function changeTimezone(date, ianatz) {

    // suppose the date is 12:00 UTC
    var invdate = new Date(date.toLocaleString('en-US', {
        timeZone: ianatz
    }));

    // then invdate will be 07:00 in Toronto
    // and the diff is 5 hours
    var diff = date.getTime() - invdate.getTime();

    // so 12:00 in Toronto is 17:00 UTC
    return new Date(date.getTime() - diff - (60 * 60 * 5 * 1000)); // needs to substract
}

function generateCode(email, date, length = 4) {
    return Number(('' + parseInt(md5('3t65AtXgJnBrYv4d' + email + date + '3t65AtXgJnBrYv4d').substr(0, 10), 16)).substr(0, length))
}

describe('Sign Up', function() {
    this.timeout(60000);
    let driver;
    let vars;

    beforeEach(async function() {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().setTimeouts({ implicit: 3000 });
        vars = {};
    });

    afterEach(async function() {
        await driver.quit();
    });

    it('Sign Up', async function() {
        let email = 'humarmorenobravo+test' + new Date().getTime() + '@gmail.com';
        let date = changeTimezone(new Date(), 'America/Toronto');

        let dateFirst = date.toJSON().split('T').join(' ').substr(0, 15);
        let dateSecond = (new Date(date.getTime() - 60 * 10 * 1000)).toJSON().split('T').join(' ').substr(0, 15);

        let code1 = generateCode(email, dateFirst);
        let code2 = generateCode(email, dateSecond);

        console.log('Codes generated for the email: ', email, ', ', code1, ', ', code2);

        console.log('Navigating to https://dev-www.talent.com/sas...');

        await driver.get('https://dev-www.talent.com/sas');

        console.log('Adding sas-token...')
        
        await driver.manage().addCookie({ name: 'sas-token', value: 'V0010_bZRTrx8KjmmO90mewWrQ11soxm-35NtwnVCNWgoQo8TkkAjZM39WC7qEwbepDTxdLZWxGeHAiko-Uf1wG4Rg%2A%2A', domain: '.talent.com', httpOnly: true});
        
        console.log('Navigating to https://dev-www.talent.com/...');
        
        await driver.get('https://dev-www.talent.com/');
        
        await driver.manage().window().setRect(1287, 580);
        
        console.log('Clicking Sign In...');

        await driver.findElement(By.linkText('Sign in')).click();

        console.log('Typing email ', email, '...');
        
        await driver.findElement(By.name('phoneOrMailCheck')).click();
        await driver.findElement(By.name('phoneOrMailCheck')).sendKeys(email);

        console.log('Typing email ', email, '...');
        
        await driver.findElement(By.id('buttonCheckEmail')).click();

        console.log('Continue...');

        await driver.findElement(By.name('confirmCode')).click();
        
        console.log('Triying wrong code 1234...');
        
        await driver.findElement(By.name('confirmCode')).sendKeys('1234');
        
        await driver.findElement(By.id('buttonConfirmCode')).click();
        await driver.sleep(2000);
        
        console.log('Triying code 1...');
        
        await driver.findElement(By.name('confirmCode')).clear();
        await driver.findElement(By.name('confirmCode')).sendKeys(code1);
        await driver.findElement(By.id('buttonConfirmCode')).click();
        
        if (!!await driver.executeScript('return (document.querySelector("[class=\'error-message has--error\']") !== null)')) {
            console.log('Wrong code');
            console.log('Triying code 2...');
            await driver.findElement(By.name('confirmCode')).sendKeys(code2);
        }
        
        await driver.sleep(2000);
        
        console.log('Skipping pop up...');
        await driver.findElement(By.css('.button--middleText')).click()
        await driver.sleep(2000);
        
        await driver.findElement(By.id('buttonCheckEmail')).click();
        await driver.sleep(2000);
        
        {
            console.log('Skipping pop up...');
            const element = await driver.findElement(By.css('.menu__dropdownTitle'))
            await driver.actions({ bridge: true }).move({origin: element}).perform()
        }
        
        console.log('Navigating to Settings...')
        await driver.findElement(By.linkText('Settings')).click();
        
        await driver.sleep(2000);
        
        await driver.findElement(By.linkText('Purge my account information')).click();
        
        await driver.sleep(2000);

        await driver.findElement(By.name('submit')).click();
        
        // await done();
    });
});
