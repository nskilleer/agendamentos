/**
 * Envia uma resposta JSON padronizada.
 * @param {object} res - Objeto de resposta do Express.
 * @param {boolean} success - Indica se a operação foi bem-sucedida.
 * @param {string} message - Mensagem descritiva.
 * @param {boolean} [logout=false] - Sinaliza ao cliente para fazer logout.
 * @param {object|array|null} [data=null] - Dados a serem retornados.
 * @returns {object} A resposta JSON.
 */
function renderJson(res, success, message, logout = false, data = null) {
    return res.json({
        success: success,
        message: message,
        logout: logout,
        data: data
    });
}

/**
 * Envia uma resposta de erro padronizada com um status code HTTP.
 * @param {object} res - Objeto de resposta do Express.
 * @param {string} message - Mensagem de erro descritiva.
 * @param {number} [statusCode=400] - Código de status HTTP.
 * @param {object|array|null} [errorData=null] - Dados adicionais sobre o erro.
 * @returns {object} A resposta JSON de erro.
 */
function renderError(res, message, statusCode = 400, errorData = null) {
    return res.status(statusCode).json({
        success: false,
        message: message,
        errorData: errorData
    });
}

// ===================================
// Exporta as funções para serem usadas em outros arquivos
// ===================================
module.exports = {
    renderJson,
    renderError
};