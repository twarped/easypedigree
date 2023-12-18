// version 3.0 code. more data for better formatting and readability. not compatible with formatpedigree.js 2.0 or lower.

(() => {
    try {
        
        let baseURI = document.body.querySelector('[data-testid="pedigree"]').baseURI;
        let pedigreeId = baseURI.split('pedigree/')[1].split('/')[1];
        let ancestorName = document.body.querySelector(`[data-testid="open-person-sheet:${pedigreeId}"]`).parentNode.querySelector('[class^="nameWrapCss"]').innerText.replace('\n', ' ');

        let pedigreeData = {
            'BASE_URI': baseURI,
            'PEDIGREE_ID': pedigreeId,
            'ANCESTOR_NAME': ancestorName,
            'ROOT_PEOPLE_DATA': [
                [...document.body.querySelectorAll('[data-testid^="asc-couple-"]')].map(e => [
                    e.dataset.testid,
                    [...e.querySelector('[class^="coupleCss"]').querySelectorAll('[class^="addWrapperCss"],[class^="nameWrapCss"]')].map(e => e.className.includes('addWrapperCss') ? [
                        e.innerText, null, null
                    ] : [
                        e.innerText, e.parentNode.querySelector('[class^="lifespan"]').innerText.split('\n')
                    ].flat())
                ].flat())
            ].flat().map(e => {
                return {
                    'husband': {
                        'name': e[1][0],
                        'lifespan': e[1][1],
                        'id': e[1][2],
                    },
                    'wife': {
                        'name': e[2][0],
                        'lifespan': e[2][1],
                        'id': e[2][2],
                    },
                    'testid': e[0],
                }
            }),
            'DESC_PEOPLE_DATA': [
                [...document.body.querySelectorAll('[data-testid^="desc-couple-"]')].map(e => [
                    e.dataset.testid,
                    [...e.querySelector('[class^="coupleCss"]').querySelectorAll('[class^="addWrapperCss"],[class^="nameWrapCss"]')].map(e => e.className.includes('addWrapperCss') ? [
                        e.innerText, null, null
                    ] : [
                        e.innerText, e.parentNode.querySelector('[class^="lifespan"]').innerText.split('\n')
                    ].flat())
                ].flat())
            ].flat().map(e => {
                return e[1][0] == 'ADD CHILD' ? {
                    'unknown': 'ADD CHILD',
                } : {
                    'husband': {
                        'name': e[1][0],
                        'lifespan': e[1][1],
                        'id': e[1][2],
                    },
                    'wife': {
                        'name': e[2][0],
                        'lifespan': e[2][1],
                        'id': e[2][2],
                    },
                    'testid': e[0],
                }
            }),
            'ROOT_EXPAND': [...document.body.querySelector('[aria-label^="Ancestors of"]').querySelectorAll('button[data-testid^="pedigree-expand-up"]')].filter(e => e.ariaLabel.includes('Collapse')).map(e => e.getAttribute('aria-describedby')),
            'DESCROOT_EXPAND': [...document.body.querySelector('[aria-label^="Descendants of"]').querySelectorAll('button[data-testid^="pedigree-expand-down"]')].filter(e => e.ariaLabel.includes('Collapse')).map(e => e.getAttribute('aria-describedby')),
            'VERSION': 3.0
        };
        console.log(pedigreeData);

        let dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(pedigreeData));
        let a = document.createElement('a');
        a.href = dataStr;
        a.download = prompt(`Pedigree (file)name defaults to:\n${ancestorName}.fsped`, ancestorName) + '.fsped';
        if (a.download == 'null.fsped') return false;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => document.body.removeChild(a), 0);
    } catch (error) {
        alert('You have to be in FamilySearch landscape or portrait mode for this to work.');
        console.error(error);
        return;
    }
})();
