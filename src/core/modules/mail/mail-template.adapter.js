/**
 * 
 * @param {*} template Class template initialize must implement method toMailData
 * @param {string} email
 * @returns This function is an adapter to return a correct format that will work
 * with MailConsumer
 */
export function MailTemplateAdapter(template, email) {
    if (!template['toMailData']) {
        throw new Error('Template mail should implement method toMailData');
    }
    return {
        template: template.toMailData(),
        email
    };
}
