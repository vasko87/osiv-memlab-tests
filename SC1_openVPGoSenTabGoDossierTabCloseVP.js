const domain = "/fw-next.ivnet.ch/";
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
 * => repeat 30 times with different VP
 * (used search VP by Name = ‘performance’
 * and taking item by item)
 */
const scenario = {
  url: () => `https://${domain}`,
  // -----------------------------------------------------------
  // skip dashboard and start measuring from vericherte search
  // -----------------------------------------------------------
  setup: async ( page ) => {
    console.log('----------------------------------------')
    console.log('----------------------------------------')
    console.log('START SETUP')
    console.log(domain)
    console.log('Login and navigate to screens vP desktop')

    console.log('----------------------------------------')
    console.log( 'clear cookies' )
    const cookies = await page.cookies();

    for (let cookie of cookies) {
      await page.deleteCookie(cookie);
    }

    console.log('----------------------------------------')
    console.log( 'reload page' )
    await page.reload();

    console.log('----------------------------------------')
    console.log('set username')
    const userNameInput = await page.waitForSelector('[name="login_name"]');
    await userNameInput.focus();
    await page.keyboard.sendCharacter('okr');

    console.log('----------------------------------------')
    console.log('set password')
    const pwdInput = await page.waitForSelector('[name="login_password"]');
    await pwdInput.focus();
    await page.keyboard.sendCharacter('okr');

    console.log('----------------------------------------')
    console.log('click login button')
    const loginButton = await page.waitForSelector('[akid="formloginGeneric-login"]');
    await loginButton.click();

    // Find and click versicherte menu block
    console.log('----------------------------------------')
    console.log('Find and click versicherte menu block')
    const versicherteMenuBlock = await page.waitForSelector('[class*="level-1"][menuname="Versicherte"]');
    await page.waitForTimeout(2000);
    await versicherteMenuBlock.click();

    // Find and click versicherte menu item
    console.log('----------------------------------------')
    console.log('find and click versicherte menu item')
    const versicherteMenuItem = await page.waitForSelector('[class*="level-2"][menuname="Versicherte"]');
    await page.waitForTimeout(2000);
    await versicherteMenuItem.click();

    // seartch for versicherte
    console.log('----------------------------------------')
    console.log('Search for Versicherte')
    const versicherteNameTxt = await page.waitForSelector('[akid="sStammQueryB-BRS_Versicherten_Name"] input');
    await page.waitForTimeout(2000);

    await versicherteNameTxt.focus();
    await page.keyboard.sendCharacter("performance");
    await page.keyboard.press('Enter');

    console.log('----------------------------------------')
    console.log('END SETUP -> snapshot here')
  },

  // -----------------------------------------------------------
  // MEASURED ACTIONS
  // -----------------------------------------------------------
  action: async ( page ) => {
    console.log('----------------------------------------')
    console.log('----------------------------------------')
    console.log('START ACTION')
    // select versichert
    console.log('----------------------------------------')
    console.log(`Open versicherter ${i-1}`)
    await page.waitForTimeout(2000);
    const versicherteLink = await page.waitForSelector(`.objbox tr:nth-child(${i}) td:nth-child(1) a`);
    await versicherteLink.click();

    console.log('----------------------------------------')
    console.log('waiting Detail page opened')
    await page.waitForTimeout(2000);
    const detailViewEl = await page.waitForSelector("[style*='opacity: 1'] [akid='sStammDetailBasisdatenForm']");
    await page.waitForTimeout(2000);

    // select dossier
    console.log('----------------------------------------')
    console.log('Navigate to SEN tab')
    const sendungenTab = await page.waitForSelector('[akid="SimpleSwatTabbar-Sendungen"] div');
    await sendungenTab.click();
    console.log('----------------------------------------')
    console.log('wait 15 sec for Sendungen loaded')
    await page.waitForTimeout(15000);

    // select dossier
    console.log('----------------------------------------')
    console.log('Navigate to dossier')
    // wait 15 sec to make sure the Versicherte screen is completely loaded
    const dossierTab = await page.waitForSelector('[akid="SimpleSwatTabbar-Dossier"] div');
    await dossierTab.click();

    // Wait 15 sec for dossier loaded
    console.log('----------------------------------------')
    console.log('wait 15 sec for dossier loaded')
    await page.waitForTimeout(15000);

    console.log('----------------------------------------')
    console.log('cklick Home btn')
    const homeBtn = await page.waitForSelector('.dhx_cell_toolbar_def');
    await homeBtn.click();
    i++;
  },

  back: async ( page ) => {
    console.log('----------------------------------------')
    console.log('----------------------------------------')
    console.log('START BACK')
    // close versicherter
    console.log('----------------------------------------')
    console.log('close versicherter')
    const closeButton = await page.waitForSelector('.vue-taskbar-group-content .vue-close-icon');
    await closeButton.click();

    console.log('----------------------------------------')
    console.log('END BACK -> snapshot here')
  },
  repeat: () => 29,
}

module.exports = scenario;
