const domain = process.argv[8];
const loop = process.argv[10];
const errorHandling = process.argv[13];
let i = 2;

/**
 * SCENARIO:
 * page-load:
 * -        pre-conditions: login -> navigation to VP tab -> searching for VP
 *
 * action-on-page:
 * -        Open VP
 * -        Goto SEN tab
 * -        GOTO Dossier tab
 * -        Go Home
 *
 * revert:
 * -        Close VP
 *
 * => repeat several times with different VP
 * (used search VP by Name = ‘performance’
 * and taking item by item)
 */
const scenario = {
    url: () => `${domain}`,
    // -----------------------------------------------------------
    // skip dashboard and start measuring from vericherte search
    // -----------------------------------------------------------
    setup: async (page) => {
        console.log(loop);
        console.log('----------------------------------------')
        console.log('----------------------------------------')
        console.log('START SETUP')
        console.log(domain)
        console.log('Login and navigate to screens vP desktop')

        console.log('----------------------------------------')
        console.log('clear cookies')
        const cookies = await page.cookies();

        for (let cookie of cookies) {
            await page.deleteCookie(cookie);
        }

        console.log('----------------------------------------')
        console.log('reload page')
        await page.reload();

        console.log('----------------------------------------')
        console.log('set username')
        const userNameInput = await page.waitForSelector('[name="login_name"]');
        await userNameInput.focus();
        await page.keyboard.sendCharacter('aut1');

        console.log('----------------------------------------')
        console.log('set password')
        const pwdInput = await page.waitForSelector('[name="login_password"]');
        await pwdInput.focus();
        await page.keyboard.sendCharacter('aut1');

        console.log('----------------------------------------')
        console.log('click login button')
        const loginButton = await page.waitForSelector('[akid="formloginGeneric-login"]');
        await loginButton.click();

        // Find and click versicherte menu block
        console.log('----------------------------------------')
        console.log('Find and click versicherte menu block')
        click('[class*="level-1"][menuname="Versicherte"]', page);
        // const versicherteMenuBlock = await page.waitForSelector('[class*="level-1"][menuname="Versicherte"]');
        // await page.waitForNetworkIdle();
        // await versicherteMenuBlock.click();

        // Find and click versicherte menu item
        console.log('----------------------------------------')
        console.log('find and click versicherte menu item')
        click('[class*="level-2"][menuname="Versicherte"]', page);
        // const versicherteMenuItem = await page.waitForSelector('[class*="level-2"][menuname="Versicherte"]');
        // await page.waitForNetworkIdle();
        // await versicherteMenuItem.click();

        // seartch for versicherte
        console.log('----------------------------------------')
        console.log('Search for Versicherte')
        const versicherteNameTxt = await page.waitForSelector('[akid="sStammQueryB-BRS_Versicherten_Name"] input');
        await page.waitForNetworkIdle();

        await versicherteNameTxt.focus();
        await page.keyboard.sendCharacter("performance");
        await page.keyboard.press('Enter');

        console.log('----------------------------------------')
        console.log('END SETUP -> snapshot here')
    },

    // -----------------------------------------------------------
    // MEASURED ACTIONS
    // -----------------------------------------------------------
    action: async (page) => {
        console.log('----------------------------------------')
        console.log('----------------------------------------')
        console.log('START ACTION')
        // select versichert
        console.log('----------------------------------------')
        console.log(`Open versicherter ${i - 1}`)
        await page.waitForNetworkIdle();
        click(`.objbox tr:nth-child(${i}) td:nth-child(1) a`, page);
        // const versicherteLink = await page.waitForSelector(`.objbox tr:nth-child(${i}) td:nth-child(1) a`);
        // await versicherteLink.click();

        console.log('----------------------------------------')
        console.log('waiting Detail page opened')
        await page.waitForNetworkIdle();
        const detailViewEl = await page.waitForSelector("[style*='opacity: 1'] [akid='sStammDetailBasisdatenForm']");
        await page.waitForNetworkIdle();

        console.log('----------------------------------------')
        console.log('Navigate to SEN tab');
        click('[akid="SimpleSwatTabbar-Sendungen"] div', page);
        // const sendungenTab = await page.waitForSelector('[akid="SimpleSwatTabbar-Sendungen"] div');
        // await sendungenTab.click();
        console.log('----------------------------------------')
        console.log('wait for Sendungen loaded')
        await page.waitForNetworkIdle();

        console.log('----------------------------------------')
        console.log('Navigate to dossier');
        click('[akid="SimpleSwatTabbar-Dossier"] div', page);
        // const dossierTab = await page.waitForSelector('[akid="SimpleSwatTabbar-Dossier"] div');
        // await dossierTab.click();

        console.log('----------------------------------------')
        console.log('wait for dossier loaded')
        await page.waitForNetworkIdle();

        console.log('----------------------------------------')
        console.log('cklick Home btn');
        click('.dhx_cell_toolbar_def', page);
        // const homeBtn = await page.waitForSelector('.dhx_cell_toolbar_def');
        // await homeBtn.click();
        i++;
    },

    back: async (page) => {
        console.log('----------------------------------------')
        console.log('----------------------------------------')
        console.log('START BACK')
        console.log('----------------------------------------')
        console.log('close versicherter');
        click('.vue-taskbar-group-content .vue-close-icon', page);
        // const closeButton = await page.waitForSelector('.vue-taskbar-group-content .vue-close-icon');
        // await closeButton.click();

        console.log('----------------------------------------')
        console.log('END BACK -> snapshot here')
    },
    repeat: () => loop - 1,
}

async function click(selector, page) {
    console.log("clicking...")
    if (errorHandling === 'true')
    {
        await clickErrorOkIfVisible(page);
    }
    const element = await page.waitForSelector(selector);
    await page.waitForNetworkIdle();
    await element.click();
}

async function clickErrorOkIfVisible(page) {
    try {
        console.log("Error handling...");
        await page.waitForNetworkIdle();
        const errorOkBtn =  await page.waitForSelector("[class='swal-modal errorModal'] [class='swal-button swal-button--confirm']", { visible: true, timeout: 3000 });
        await errorOkBtn.click();
        console.log("clicked Error [OK] btn");
    } catch (error) {
        console.log("NO Error");
    }
}

module.exports = scenario;
