import os

env_dist = os.environ # environ是在os.py中定义的一个dict environ = {}

# 打印所有环境变量，遍历字典
# 对应方案2: 下载到本地,需要此处填写
cookies1 = "1&_device=iPad&6AA7AC63-E875-4FEE-9925-1F3236FD091D&1.1.12; 1&_token=95640332&17CB22B0140C006B83C08C29561244EFED7005DAAB5BF029544A5B7A5575B15D6D8962790D6B168MA359F2194EA6F72_; NSUP=42E2F746%2C41B203F1%2C1605617188864; XUM=6AA7AC63-E875-4FEE-9925-1F3236FD091D; ainr=0; c-oper=%E6%9C%AA%E7%9F%A5; channel=ios-b1; device_model=iPad 6; idfa=6AA7AC63-E875-4FEE-9925-1F3236FD091D; impl=com.ximalaya.tingLite; ip=192.168.123.60; net-mode=WIFI; res=750%2C1334; _xmLog=h5&347d88f3-8ca6-4d93-bada-8cedcfdc782a&2.2.5"
cookies2 = "1&_device=android&029df9ce-584c-3ad4-9ba1-72f7e1fffebd&1.8.42;1&_token=267683138&2084A930140C2BD6FC4AF630D261A78A68587BAA5001C89D703372C39C54CF17E76290C16ED1162M9ecb27b39065F2C_;channel=cash;impl=com.ximalaya.ting.lite;osversion=29;device_model=Redmi+Note+8+Pro;XUM=KBZ/jn59;XIM=;c-oper=%E6%9C%AA%E7%9F%A5;net-mode=WIFI;res=1080%2C2220;NSUP=;AID=vlxabo+8DyE=;manufacturer=Xiaomi;XD=Aew625t0JqDdgxfPz2a0jqnn9C96Vp8sDnyKtjjvRLMAcNU4cB6OYAqlQMYA9SYz8S0lQVZmaqxIgkRe5R2D0jv+sBrnoIeYcqsRwwjWla4R8gX6K8BZ13TSOHeJh6IaI4pb0hhOkd+seLsmTENaDw==;umid=2082fb932a6046f651113ca6228d612cod;xm_grade=1000;oaid=4cf90c49d511035;" 
cookies3 = "1&_device=android&677642a9-c07e-3152-b2e9-ceb5183bec3e&1.8.42;1&_token=182636146&D99B66B0140C6ABE6AF8E79E35E4E97C4AA91200400069198B718418135C1E099E169D2DFE5072M79e2e5368B5F9E5_;channel=and-d3;impl=com.ximalaya.ting.lite;osversion=28;device_model=VTR-AL00;XUM=eGJWZREs;XIM=3146b1294cc4c;c-oper=%E6%9C%AA%E7%9F%A5;net-mode=WIFI;res=1080%2C1792;NSUP=;AID=H9ztglKi0hs=;manufacturer=HUAWEI;XD=E9ulgQ5CtUDsJvThjWUnKzrwVuoD4NvMCFfOJNgMbnBt4nO4tkEA3sCZQr8T3m9464PWAO5NRfppKtnVh8iYE9VYS6YDkTJ/Qixy3pG1cLf0Nl8GTPEeTC+YIA1z2rEcIPuggY/oR8BPtXJHLrySyj2XIMAuvoKltB2YRrkWbWaxepB8F7NToJ+J+xo1zOVW;umid=ai733de5190900dfc7db8cefc85a9ec5bd;xm_grade=1000;oaid=7f7ff5fa-55d7-f9e9-efc7-fbe5fd3e2c2b;"
cookiesList = [cookies1,cookies2,cookies3]   # 多账号准备

# 通知服务

###################################################
# 对应方案1:  GitHub action自动运行,此处无需填写;
if "XMLY_SPEED_COOKIE" in os.environ:
    """
    判断是否运行自GitHub action,"XMLY_SPEED_COOKIE" 该参数与 repo里的Secrets的名称保持一致
    """
    print("执行自GitHub action")
    xmly_speed_cookie = os.environ["XMLY_SPEED_COOKIE"]
    cookiesList = []  # 重置cookiesList
    for line in xmly_speed_cookie.split('\n'):
        if not line:
            continue
        cookiesList.append(line)
        print (line)
