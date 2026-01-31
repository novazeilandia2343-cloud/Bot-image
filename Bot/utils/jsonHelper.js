const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const IMAGES_PATH = path.join(DATA_DIR, 'images.json');

/**
 * Garante que a pasta /data existe
 */
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Lê um arquivo JSON com segurança
 * @param {string} filePath - Caminho do arquivo
 * @param {object} defaultValue - Valor padrão se o arquivo não existir
 * @returns {Promise<object>}
 */
async function readJSON(filePath, defaultValue = {}) {
  try {
    ensureDataDir();
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const data = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Erro ao ler JSON (${filePath}):`, err.message);
    return defaultValue;
  }
}

/**
 * Escreve um objeto em arquivo JSON
 * @param {string} filePath - Caminho do arquivo
 * @param {object} data - Dados a salvar
 * @returns {Promise<void>}
 */
async function writeJSON(filePath, data) {
  try {
    ensureDataDir();
    await fs.promises.writeFile(
      filePath,
      JSON.stringify(data, null, 2),
      'utf-8'
    );
  } catch (err) {
    console.error(`Erro ao escrever JSON (${filePath}):`, err.message);
    throw err;
  }
}

/**
 * Lê images.json
 */
async function readImages() {
  return readJSON(IMAGES_PATH, {});
}

/**
 * Salva images.json
 */
async function writeImages(data) {
  return writeJSON(IMAGES_PATH, data);
}

module.exports = {
  ensureDataDir,
  readJSON,
  writeJSON,
  readImages,
  writeImages,
  IMAGES_PATH,
  DATA_DIR
};
