// Fetch CSV data from Google Sheets and populate product cards
(function(){
    const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1PzvzgKrTeDkESZUb38Iq3mwdiM91K5PrvrFmFNn5U9Y/export?format=csv';

    function parseCSV(text){
        const rows = [];
        const lines = text.trim().split(/\r?\n/);
        const headers = parseRow(lines.shift());
        lines.forEach(l => {
            if(!l.trim()) return;
            const values = parseRow(l);
            const obj = {};
            headers.forEach((h,i) => obj[h] = values[i] || '');
            rows.push(obj);
        });
        return rows;
    }

    function parseRow(row){
        const result = [];
        let cur = '', inQuotes = false;
        for(let i=0;i<row.length;i++){
            const ch = row[i];
            if(ch === '"'){
                if(inQuotes && row[i+1] === '"'){ cur += '"'; i++; }
                else inQuotes = !inQuotes;
            } else if(ch === ',' && !inQuotes){
                result.push(cur);
                cur = '';
            } else {
                cur += ch;
            }
        }
        result.push(cur);
        return result;
    }

    function createCard(p){
        const col = document.createElement('div');
        col.className = 'col-xl-3 col-md-4';
        const img = 'https://hidasangyo.com/en/ogp.jpg';
        col.innerHTML = `\n            <div class="single-product" data-name="${p['Product Name']}" data-desc="${p['Product Size']}" data-price="${p['Type']}" data-image="${img}">\n                <div class="product-img">\n                    <a href="#"><img src="${img}" alt="${p['Product Name']}" /></a>\n                </div>\n                <div class="product-info clearfix text-center">\n                    <div class="fix"><h4 class="post-title"><a href="#">${p['Product Name']}</a></h4></div>\n                    <div class="fix"><span class="new-price">${p['Type']}</span></div>\n                </div>\n            </div>\n        `;
        return col;
    }

    function fillModal(p){
        const modal = document.getElementById('productModal');
        if(!modal) return;
        modal.querySelector('.modal-product .main-image img').src = p.image;
        modal.querySelector('.modal-product h1').textContent = p.name;
        modal.querySelector('.modal-product .new-price').textContent = p.price;
        modal.querySelector('.modal-product .quick-desc').textContent = p.desc;
        new bootstrap.Modal(modal).show();
    }

    function init(){
        fetch(SHEET_URL).then(r => r.text()).then(t => {
            const data = parseCSV(t);
            const products = data.filter(d => d['Categoría'] === 'SILLAS Y SOFÁS');
            const container = document.getElementById('product-container');
            if(!container) return;
            products.forEach(p => container.appendChild(createCard(p)));
            container.addEventListener('click', e => {
                const product = e.target.closest('.single-product');
                if(product){
                    fillModal({
                        name: product.dataset.name,
                        desc: product.dataset.desc,
                        image: product.dataset.image,
                        price: product.dataset.price
                    });
                }
            });
        });
    }

    if(document.readyState !== 'loading') init();
    else document.addEventListener('DOMContentLoaded', init);
})();
