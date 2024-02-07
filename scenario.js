const domain = "/osiv-nrtest.ivnet.ch";

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
    const versicherteMenuBlock = await page.waitForSelector('[menuname="Versicherte"]');
    
    // Wait a bit to make sure that the menu is clickable
    await page.waitForTimeout(2000);
    await versicherteMenuBlock.click();

    // Find and click versicherte menu item
    console.log('----------------------------------------')
    console.log('find and click versicherte menu item')
    const versicherteMenuItem = await page.waitForSelector('.vsm--link_level-2[menuname="Versicherte"]');
    await versicherteMenuItem.click();

    // seartch for versicherte
    console.log('----------------------------------------')
    console.log('Search for Versicherte')
    const versicherteInput = await page.waitForSelector('[akid="sStammQueryB-BRS_Versicherten_Name"] input');

    // await here 3 second before continuing in order to not interfer with filters loading
    await page.waitForTimeout(3000);

    await versicherteInput.focus();
    await page.keyboard.sendCharacter('mühlebach');
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
    console.log('Select/open versicherter')
    const versicherteLink = await page.waitForSelector('.akcelllink');
    await versicherteLink.click();

    // select dossier
    console.log('----------------------------------------')
    console.log('Select dossier')
    await page.waitForTimeout(15000);
     // wait 15 sec to make sure the Versicherte screen is completely loaded
    const dossierTab = await page.waitForSelector('[akid="SimpleSwatTabbar-Dossier"] div');
    dossierTab.click();

    // Wait 15 sec for dossier loaded
    console.log('----------------------------------------')
    console.log('wait 15 sec for dossier loaded')
    await page.waitForTimeout(15000);

    console.log('----------------------------------------')
    console.log('END ACTION -> snapshot here')
  },
  back: async ( page ) => {
    console.log('----------------------------------------')
    console.log('----------------------------------------')
    console.log('START BACK')
    // close versicherter
    console.log('----------------------------------------')
    console.log('close versicherter')
    const closeButton = await page.waitForSelector('.dhxwin_button.dhxwin_button_close');
    await closeButton.click();

    console.log('----------------------------------------')
    console.log('END BACK -> snapshot here')
  },
  // how often to repeat a run after first default run
  // 0 = 1 run, 1 = 2 runs, 2 = 3 runs, ...
  repeat: () => 9,
  // filter out leaked objects smaller than ...
  // leakFilter: ( node, _snapshot, _leakedNodeIds ) => {
  //   const oneKb     = 1000;
  //   const hundredKb = 100 * oneKb;
  //   const oneMb     = 10 * hundredKb;
  //   return node.retainedSize > oneKb;
  // }
}

module.exports = scenario;
