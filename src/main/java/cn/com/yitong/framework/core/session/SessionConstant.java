package cn.com.yitong.framework.core.session;

/**
 * SESSION相关全局变量
 * Created by zhuzengpeng on 2016/3/7.
 */
public class SessionConstant {

    //与SESSION绑定的AES加密密钥
    public static final String AESKEY = "aeskey";

    //返回JSON值中包含此值
    public static final String SESSIONID = "sessionId";

    //客户端生成的AESKEY
    public static final String CLIENT_AESKEY = "clientskey";

    //当前SESSION是否是登陆成功(1:登陆成功  0:未登陆)
    public static final String LOGIN_FLAG = "loginFlag";
    //登陆成功标识
    public static final String LOGIN_FLAG_YES = "1";
    //登陆失败标识
    public static final String LOGIN_FLAG_NO = "0";

    //服务端返回值的加密方式 1：使用客户端传送来的AES密钥加密(登陆功能和刷新SESSION接口)  2：普通接口返回加密方式
    public static final String ENCRY_TYPE = "encryType";

    //使用客户端传送来的AES密钥加密(登陆功能和刷新SESSION接口)
    public static final String ENCRY_TYPE_1 = "1";
    //普通接口返回加密方式
    public static final String ENCRY_TYPE_2 = "2";

    //spring session请求头和响应头都通过此变量传递SESSIONID
    public static final String HEADERNAME_X_AUTH_TOKEN = "x-auth-token";
}
