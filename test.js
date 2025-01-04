const { Builder, By, Key, until } = require('selenium-webdriver');

async function loadHomePage(driver) {
  await driver.get('https://www.lojarelvaverde.com.br/');
  console.log('Página carregada');
}

async function locateSearchIcon(driver) {
  let searchIcon = await driver.wait(until.elementLocated(By.css('[data-icon="search"]')), 10000);
  if (searchIcon) {
    console.log('Ícone de busca encontrado');
    await searchIcon.click();
    console.log('Ícone de busca clicado');
  } else {
    throw new Error('Ícone de busca não encontrado');
  }
}

async function performSearch(driver, searchTerm) {
  let searchBox = await driver.wait(until.elementLocated(By.css('#keywords')), 10000);
  console.log('Barra de busca localizada');
  await searchBox.sendKeys(searchTerm, Key.RETURN);
  console.log(`Texto "${searchTerm}" enviado para a barra de busca`);
}

async function validateSearchResults(driver) {
  await driver.wait(until.elementLocated(By.css('.collection-grid')), 5000);
  console.log('Resultados da busca carregados');

  let results = await driver.findElements(By.css('.collection-grid .collection-grid-card'));
  console.log("Quantidade de itens encontrados: " + results.length);

  // Exibe os preços dos primeiros 3 itens, caso existam
  for (let i = 0; i < Math.min(3, results.length); i++) {
    let priceElement = await results[i].findElement(By.css(".price"));
    let price = await priceElement.getText();
    console.log(i + ": " + price);
  }
}

async function main() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await loadHomePage(driver);
    await locateSearchIcon(driver);
    await performSearch(driver, 'aveia');
    await validateSearchResults(driver);

    // Adiciona um atraso de 5 segundos para observação
    await new Promise(resolve => setTimeout(resolve, 5000));
  } catch (error) {
    console.error('Erro durante a execução do teste:', error);
  } finally {
    await driver.quit();
  }
}

main();
