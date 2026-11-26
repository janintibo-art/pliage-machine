'use strict';
// Nominal catalogue data only. Never used directly as collision geometry.
window.ManufacturerTools=[
 ...[[12,15,'ED0748251'],[14,17,'ED0768251'],[16,20,'ED0778251'],[18,22,'ED0788251']].map(([v,w,ref])=>({brand:'AMADA',type:'die',name:`AFH ${ref} · V${v}`,angle:86,v,w,h:60,r:2.5,length:835,source:'https://cdn.amada.eu/fileadmin/user_upload/NEWAFHStandard_Complete.pdf (p. 40)'})),
 {brand:'TRUMPF',type:'punch',name:'OW200/K · 0825696',angle:86,h:120,r:1,length:1250,source:'https://trushop.my.trumpf.com/en_GB/bending-tools/standard-bending-tools/upper-tools/punch//punch-ow200-k-r1-86-120-1250-b-0825696'},
 {brand:'TRUMPF',type:'punch',name:'OW200/S · 1604676',angle:86,h:218.5,r:3,length:15,source:'https://trushop.my.trumpf.com/en_GB/bending-tools/standard-bending-tools/upper-tools/punch/punch-ow200-s-r3-86-218.5-15-1604676'},
 {brand:'TRUMPF',type:'die',name:'EV022/S · 0834571 · V10',angle:86,v:10,r:1,length:3050,source:'https://trushop.my.trumpf.com/en_GB/bending-tools/standard-bending-tools/lower-tools/single-v-die/die-ev022-s-w10-86-r1-3050-b-0834571'},
 {brand:'TRUMPF',type:'die',name:'EV/H · 0858783 · V16',angle:84,v:16,r:1.6,length:50,source:'https://trushop.my.trumpf.com/en_US/bending-tools/standard-bending-tools/lower-tools/single-v-die/die-ev-h-w16-84-r1.6-50-0858783'}
];
