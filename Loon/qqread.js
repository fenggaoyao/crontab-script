const jsname = '企鹅读书'
const $ = Env(jsname)

const qqreadbodyVal = $request.body;
if (qqreadbodyVal)
{
$.setdata(qqreadbodyVal, "qqreadbody_Test_Key");
$.log(`[${jsname}] 获取更新body: 成功,qqreadbodyVal: ${qqreadbodyVal}`);
$.msg(jsname, `获取更新body: 成功🎉`, ``);
} 


$.done();