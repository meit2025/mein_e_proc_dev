const a=(e,t=!0)=>{const r=new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR"}).format(Number(e));return t?r:r.replace(/^Rp\s*/,"")};export{a as f};
