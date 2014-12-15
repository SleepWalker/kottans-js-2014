console.log(html`<b>${process.argv[2]} says</b>: "${process.argv[3]}"`);

function html(tpl, ...args) {
    args = args.map((str) => str
        .replace(/&/g, '&amp;')
        .replace(/'/g, '&#39;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&rt;')
    );

    return tpl.reduce((acc, str, index) => acc + str + (args[index] || ''), '');
}
