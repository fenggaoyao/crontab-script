const fs = require("fs");

!(async ()=>{
    const replacements = { 
        "./sendNotify.js":[
            {
                key:"let SCKEY = '';",
                value:"let SCKEY = 'SCU67315T029420ac8f2652199476b5a1fe21bc2f5ddd5d58a643e';"         
            }
        ],
        "./jd_fruit.js":[
            {
                key:"const readShareCodeRes = await readShareCode();",
                value:"const readShareCodeRes = []"
            }
        ],
        "./jd_dreamFactory.js":[
            {
                key:"await updateTuanIds();",
                value:"await updateTuanIds('http://47.107.178.185:8080/jd_updateFactoryTuanId.json');"               
            }, 
            {
              key:"if (!$.tuanIdS) await updateTuanIdsCDN();",
              value:"if (!$.tuanIdS) await updateTuanIdsCDN('http://47.107.178.185:8080/jd_updateFactoryTuanId.json');"               
            },
            {
                key:"const readShareCodeRes = await readShareCode();",
                value:"const readShareCodeRes = null;"               
             },
        ],        
      "./jd_superMarket.js":[
        {
          key:"await businessCircleActivity();//商圈活动",
          value:""
        },
      ],
      //京小wo
      "./jd_small_home.js":[
        {
          key:"await updateInviteCode()",
          value:"await updateInviteCode('http://47.107.178.185:8080/jd_updateSmallHomeInviteCode.json')"
        },
        {
          key:"if (!$.inviteCodes) await updateInviteCodeCDN()",
          value:"if (!$.inviteCodes) await updateInviteCodeCDN('http://47.107.178.185:8080/jd_updateSmallHomeInviteCode.json')"
        },
      ],
      "./jd_pet.js":[
        {
          key:"const readShareCodeRes = await readShareCode();",
          value:"const readShareCodeRes = null;"
        }      
      ],
      "./jd_jdfactory.js":[
        {
          key:"const readShareCodeRes = await readShareCode();",
          value:"const readShareCodeRes = null;"
        }      
      ],
      "./jd_plantBean.js":[
        {
          key:"const readShareCodeRes = await readShareCode();",
          value:"const readShareCodeRes = null;"
        }      
      ],
      "./jd_split.js":[
        {
          key:/\$\.newShareCodes\s*=\s*\[[\s\S]*?\][\s]*?;/,
          value:"$.newShareCodes = ['P04z54XCjVUnIaW5mNdVjerhS0V39KK','P04z54XCjVUnIaW5mNdVjevjCMDxEE','P04z54XCjVUnIaW5uOltrVHYanfGPMSZKzUwUV1XYk6','P04z54XCjVUnIaW5lFsdx_5338'];"
        }      
      ],
      "./jd_health.js":[
        {
          key:/const\s*inviteCodes\s*=\s*\[[\s\S]*?\][\s]*?;/,
          value:`const inviteCodes = [
            'P04z54XCjVUnoaW5mNdVjevjCMDxJ8@P04z54XCjVUnoaW5uOltrVHYanfGGc0w5dKNLPAMTfp@P04z54XCjVUnoaW5m9cZ2f9iSgeksT6a-Tw82k',
            'P04z54XCjVUnoaW5mNdVjerhS0V33Pz@P04z54XCjVUnoaW5uOltrVHYanfGGc0w5dKNLPAMTfp@P04z54XCjVUnoaW5m9cZ2f9iSgeksT6a-Tw82k',
            'P04z54XCjVUnoaW5mNdVjerhS0V33Pz@P04z54XCjVUnoaW5mNdVjevjCMDxJ8@P04z54XCjVUnoaW5m9cZ2f9iSgeksT6a-Tw82k',
            'P04z54XCjVUnoaW5mNdVjerhS0V33Pz@P04z54XCjVUnoaW5mNdVjevjCMDxJ8@P04z54XCjVUnoaW5uOltrVHYanfGGc0w5dKNLPAMTfp@P04z54XCjVUnoaW5m9cZ2f9iSgeksT6a-Tw82k',
            'P04z54XCjVUnoaW5mNdVjerhS0V33Pz@P04z54XCjVUnoaW5mNdVjevjCMDxJ8@P04z54XCjVUnoaW5uOltrVHYanfGGc0w5dKNLPAMTfp@P04z54XCjVUnoaW5m9cZ2f9iSgeksT6a-Tw82k',
            'P04z54XCjVUnoaW5mNdVjerhS0V33Pz@P04z54XCjVUnoaW5mNdVjevjCMDxJ8@P04z54XCjVUnoaW5uOltrVHYanfGGc0w5dKNLPAMTfp@P04z54XCjVUnoaW5m9cZ2f9iSgeksT6a-Tw82k',
            'P04z54XCjVUnoaW5mNdVjerhS0V33Pz@P04z54XCjVUnoaW5mNdVjevjCMDxJ8@P04z54XCjVUnoaW5uOltrVHYanfGGc0w5dKNLPAMTfp@P04z54XCjVUnoaW5m9cZ2f9iSgeksT6a-Tw82k',
            'P04z54XCjVUnoaW5mNdVjerhS0V33Pz@P04z54XCjVUnoaW5mNdVjevjCMDxJ8@P04z54XCjVUnoaW5uOltrVHYanfGGc0w5dKNLPAMTfp@P04z54XCjVUnoaW5m9cZ2f9iSgeksT6a-Tw82k',
            'P04z54XCjVUnoaW5mNdVjerhS0V33Pz@P04z54XCjVUnoaW5mNdVjevjCMDxJ8@P04z54XCjVUnoaW5uOltrVHYanfGGc0w5dKNLPAMTfp@P04z54XCjVUnoaW5m9cZ2f9iSgeksT6a-Tw82k',
            'P04z54XCjVUnoaW5mNdVjerhS0V33Pz@P04z54XCjVUnoaW5mNdVjevjCMDxJ8@P04z54XCjVUnoaW5uOltrVHYanfGGc0w5dKNLPAMTfp@P04z54XCjVUnoaW5m9cZ2f9iSgeksT6a-Tw82k'
          ];`
        }      
      ],
    };
    Object.keys(replacements).forEach(async (item)=>{
        if(item){
            let filecontent=await readFileAsync(item)
            filecontent= batchReplace(filecontent,replacements[item])        
            await writeFileAsync(item, filecontent);
        }
    })
    console.log("替换jdCookie")
    await replaceFile("./jdCookie-.js","./jdCookie.js");

    console.log("替换jdDreamFactoryShareCodes")
    await replaceFile("./jdDreamFactoryShareCodes-.js","./jdDreamFactoryShareCodes.js")

    console.log("替换jdFactoryShareCodes")
    await replaceFile("./jdFactoryShareCodes-.js","./jdFactoryShareCodes.js")

    console.log("替换jdFruitShareCodes")
    await replaceFile("./jdFruitShareCodes-.js","./jdFruitShareCodes.js")

    console.log("替换jdJxStoryShareCodes")
    await replaceFile("./jdJxStoryShareCodes-.js","./jdJxStoryShareCodes.js")

    console.log("替换jdPetShareCodes")
    await replaceFile("./jdPetShareCodes-.js","./jdPetShareCodes.js")

    console.log("替换jdPlantBeanShareCodes")
    await replaceFile("./jdPlantBeanShareCodes-.js","./jdPlantBeanShareCodes.js")

    console.log("替换jdSuperMarketShareCodes")
    await replaceFile("./jdSuperMarketShareCodes-.js","./jdSuperMarketShareCodes.js")

})() .catch((e) => {
    console.log(e)
  })


  function batchReplace(content, replacements) {
    for (let i = 0; i < replacements.length; i++) {      
      content = content.replace(replacements[i].global=="true"?new RegExp(replacements[i].key, 'g') :replacements[i].key, replacements[i].value);
    }
    return content;
  }

 async function replaceFile(from,to){
    let filecontent=await readFileAsync(from)
    await writeFileAsync(to, filecontent);
  }

  function readFileAsync(filename){
      return new Promise((resolve,reject)=>{
        fs.readFile(filename, 'utf8',(err, data) => {
            if (err) reject(err);
            resolve(data);
          });
      })
  }

  
  function writeFileAsync(filename,content){
    return new Promise((resolve,reject)=>{
      fs.writeFile(filename,content, 'utf8',(err) => {
          if (err) reject(err);
          resolve();
        });
    })
}





