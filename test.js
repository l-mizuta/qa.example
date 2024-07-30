const { Builder, By, Key, until } = require('selenium-webdriver');

async function driver() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('https://www.lojarelvaverde.com.br/');
    console.log('Página carregada');

    // Espera até que o ícone de busca esteja localizado e visível
    let searchIcon = await driver.wait(until.elementLocated(By.css('[data-icon="search"]')), 10000);

    // Verifica se o ícone de busca foi encontrado
    if (searchIcon) {
    console.log('Ícone de busca encontrado');
    await searchIcon.click();
    console.log('Ícone de busca clicado');
  }
    else {
    console.error('Ícone de busca não encontrado');
  }    

    // Localiza a barra de busca pelo ID
    let searchBox = await driver.wait(until.elementLocated(By.css('#keywords')), 10000);
    console.log('Barra de busca localizada');

    // Envia o texto "Geladeira" para a barra de busca e pressiona ENTER
    await searchBox.sendKeys('aveia', Key.RETURN);
    console.log('Texto enviado para a barra de busca');

    // Aguarda os resultados da busca aparecerem
    await driver.wait(until.elementLocated(By.css('.collection-grid')), 5000);
    console.log('Resultados da busca carregados');

    // Localiza os resultados da busca (results.length ou número)
    let results = await driver.findElements(By.css('.collection-grid .collection-grid-card'));
    console.log("Quantidade de itens encontrados: " + results.length);
    for (let i = 0; i < 3; i++) {
      let priceElement = await results[i].findElement(By.css(".price"));
      let price = await priceElement.getText();
      console.log(i + ": " + price);
  }

    // Adiciona um atraso de 5 segundos para observar o comportamento
    await new Promise(resolve => setTimeout(resolve, 5000));
  } 
  
  catch (error) {
    console.error('Erro durante a execução do teste:', error);
  } 
  
  finally {
    await driver.quit();
  }
}

driver();