javascript: (() => {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(
        { "ROOT": (() => { 
            window.ROOT = [document.querySelector("#main-content-section > tree-app")
                .shadowRoot.querySelector("#pages > tree-pedigree").shadowRoot.querySelector("#pedigree")
                .shadowRoot.querySelector("#pedigree > div:nth-child(1) > pedigree-couple-renderer.node[data-test-couple-ahnentafel='1']")
                , ...Array.from(document.querySelector("#main-content-section > tree-app")
                    .shadowRoot.querySelector("#pages > tree-pedigree").shadowRoot.querySelector("#pedigree")
                    .shadowRoot.querySelectorAll("#pedigree > div:nth-child(1) > pedigree-couple-renderer.node")
                ).filter(c => { 
                    try { 
                        return c.shadowRoot.querySelector("div.couple-wrapper").parentNode
                            .querySelector("button.append-pedigree").title.includes("Collapse") 
                    } catch (e) { return false } 
                })];
            return window.ROOT; 
        })().map(couple => { 
            return couple.coupleId.slice(0, -2) 
        }).reduce((p, c, i) => ({ ...p
            , [window.ROOT[i].attributes["data-test-couple-ahnentafel"].nodeValue]: c 
        }), 
        {})
        , "ROOTNAMES": (() => {
            window.ROOTNAMES = []
        })(), "DESCROOT": (() => { window.DESCROOT = [document.querySelector("#main-content-section > tree-app").shadowRoot.querySelector("#pages > tree-pedigree").shadowRoot.querySelector("#pedigree").shadowRoot.querySelector("#pedigree > div:nth-child(1) > pedigree-couple-renderer.node[data-test-couple-ahnentafel='1']"), ...Array.from(document.querySelector("#main-content-section > tree-app").shadowRoot.querySelector("#pages > tree-pedigree").shadowRoot.querySelector("#pedigree").shadowRoot.querySelectorAll("#pedigree > div:nth-child(1) > pedigree-couple-renderer.desc-node")).filter(c => { try { return c.shadowRoot.querySelector("div.couple-wrapper").parentNode.querySelector("button.append-pedigree").title.includes("Collapse") } catch (e) { return false } })]; return window.DESCROOT; })().map(couple => { return couple.coupleId.slice(0, couple.coupleId.includes(".") ? -4 : -2) }).reduce((p, c, i) => ({ ...p, [window.DESCROOT[i].attributes["data-test-couple-ahnentafel"].nodeValue]: c }), {}) })); var a = document.createElement("a"); a.href = dataStr; a.download = prompt("Pedigree (file)name:", "pedigree") + ".json"; document.body.appendChild(a); a.click(); setTimeout(() => document.body.removeChild(a), 0);
})();