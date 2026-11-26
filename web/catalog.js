'use strict';
// Nominal catalogue data only. Never used directly as collision geometry.
window.ManufacturerTools=[
 ...[[12,15,'ED0748251'],[14,17,'ED0768251'],[16,20,'ED0778251'],[18,22,'ED0788251']].map(([v,w,ref])=>({brand:'AMADA',type:'die',name:`AFH ${ref} · V${v}`,angle:86,v,w,h:60,r:2.5,length:835,source:'https://cdn.amada.eu/fileadmin/user_upload/NEWAFHStandard_Complete.pdf (p. 40)'})),
 {brand:'TRUMPF',type:'punch',name:'OW200/K · 0825696',angle:86,h:120,r:1,length:1250,source:'https://trushop.my.trumpf.com/en_GB/bending-tools/standard-bending-tools/upper-tools/punch//punch-ow200-k-r1-86-120-1250-b-0825696'},
 {brand:'TRUMPF',type:'punch',name:'OW200/S · 1604676',angle:86,h:218.5,r:3,length:15,source:'https://trushop.my.trumpf.com/en_GB/bending-tools/standard-bending-tools/upper-tools/punch/punch-ow200-s-r3-86-218.5-15-1604676'},
 {brand:'TRUMPF',type:'die',name:'EV022/S · 0834571 · V10',angle:86,v:10,r:1,length:3050,source:'https://trushop.my.trumpf.com/en_GB/bending-tools/standard-bending-tools/lower-tools/single-v-die/die-ev022-s-w10-86-r1-3050-b-0834571'},
 {brand:'TRUMPF',type:'die',name:'EV/H · 0858783 · V16',angle:84,v:16,r:1.6,length:50,source:'https://trushop.my.trumpf.com/en_US/bending-tools/standard-bending-tools/lower-tools/single-v-die/die-ev-h-w16-84-r1.6-50-0858783'}
];

// References from AMADA 2021 catalogue, nominal data only (printed p. 68–69).
window.ManufacturerTools.push(
 ...[[20,3,86,'0798305'],[25,3,86,'0828305'],[32,4,84,'0874405'],[40,4,84,'0884405']].map(([v,r,angle,ref])=>({brand:'AMADA',type:'die',name:`AFH-ATC ${ref} · V${v}`,angle,v,r,h:60,length:200,source:'https://cdn.amada.eu/fileadmin/Repository/Amada_Tooling_price_list_2021_BENDING1.pdf (p. 68–69, 200 mm div.)'})),
 {brand:'TRUMPF',type:'die',name:'EV026 · 0824397 · V24',angle:86,v:24,r:2.5,length:500,source:'https://trushop.my.trumpf.com/en_US/bending-tools/standard-bending-tools/lower-tools/single-v-die/die-ev026-w24-86-r2.5-500-0824397'}
);

// Nominal values from public manufacturer listings, not complete cross sections.
window.ManufacturerTools.push(
 ...[[704,86,.6,835,'7048061'],[704,86,1.5,835,'7048151'],[704,86,3,835,'7048301'],[704,88,.6,415,'7047062'],[747,86,.6,835,'7478061'],[747,88,.6,415,'7477062']].map(([family,angle,r,length,ref])=>({brand:'AMADA',type:'punch',name:`AFH ${family} · ${ref}`,angle,r,h:90,length,source:'https://online.flippingbook.com/view/67613920/13/ (catalogue 2025, page imprimée 10)'})),
 ...[
 ['OW200/S · 0824481',86,1,220,100,'upper-tools/punch/punch-ow200-s-r1-86-220-100-hl-mon.-0824481'],
 ['OW200/K · 0832064',86,6,117.3,100,'upper-tools/punch/punch-ow200-k-r6-86-117.3-100-hl-0832064'],
 ['OW300/S · 1469377',86,4,298.3,200,'upper-tools/punch/punch-ow300-s-r4-86-298.3-200-1469377']
 ].map(([name,angle,r,h,length,url])=>({brand:'TRUMPF',type:'punch',name,angle,r,h,length,source:'https://trushop.my.trumpf.com/'+(name.includes('1469377')?'en_US':'en_GB')+'/bending-tools/standard-bending-tools/'+url})),
 ...[
 ['EV023/S · 0832448 · V12',12,86,1,1250,'die-ev023-s-w12-86-r1-1250-b-0832448'],
 ['EV025 · 0825897 · V20',20,86,2,300,'die-ev025-w20-86-r2-300-0825897'],
 ['EV · 0858724 · V12',12,84,1,500,'die-ev-w12-84-r1-500-0858724']
 ].map(([name,v,angle,r,length,url])=>({brand:'TRUMPF',type:'die',name,v,angle,r,length,source:'https://trushop.my.trumpf.com/'+(name.includes('0858724')?'en_GB':'en_US')+'/bending-tools/standard-bending-tools/lower-tools/single-v-die/'+url}))
);
