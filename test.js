const { Builder, By, Key, until } = require('selenium-webdriver');

async function main() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    // Acessa o site
    await driver.get('https://www.lojarelvaverde.com.br/');
    console.log('Página carregada');

    // Localiza o ícone de busca
    const searchIcon = await driver.wait(
      until.elementLocated(By.css('[data-icon="search"]')),
      10000
    );
    console.log('Ícone de busca encontrado');
    await searchIcon.click();
    console.log('Ícone de busca clicado');

    // Localiza a barra de busca e realiza a busca por "aveia"
    const searchBox = await driver.wait(
      until.elementLocated(By.css('#keywords')),
      10000
    );
    console.log('Barra de busca localizada');
    await searchBox.sendKeys('aveia', Key.RETURN);
    console.log('Texto enviado para a barra de busca');

    // Aguarda o carregamento dos resultados
    await driver.wait(
      until.elementLocated(By.css('.collection-grid')),
      5000
    );
    console.log('Resultados da busca carregados');

    // Localiza os resultados
    const results = await driver.findElements(By.css('.collection-grid .collection-grid-card'));
    console.log(`Quantidade de itens encontrados: ${results.length}`);

    // Processa os preços dos primeiros 3 itens usando Promise.allSettled
    const prices = await Promise.allSettled(
      results.slice(0, 3).map(async (result, index) => {
        try {
          const priceElement = await result.findElement(By.css('.price'));
          const price = await priceElement.getText();
          return { index, price };
        } catch (error) {
          return { index, error: 'Erro ao buscar preço' };
        }
      })
    );

    // Exibe os resultados dos preços
    prices.forEach(({ status, value, reason }) => {
      if (status === 'fulfilled') {
        console.log(`Item ${value.index + 1}: ${value.price}`);
      } else {
        console.error(`Erro ao buscar o preço do item ${reason.index + 1}`);
      }
    });

    // Adiciona um atraso para observar o comportamento
    await new Promise(resolve => setTimeout(resolve, 5000));
  } catch (error) {
    console.error('Erro durante a execução do teste:', error);
  } finally {
    // Finaliza o driver
    await driver.quit();
  }
}

// Executa a função principal
main();
