package cn.com.yitong.framework.support;

import cn.com.yitong.framework.core.encrypt.AESHelper;
import cn.com.yitong.framework.core.encrypt.Base64;
import cn.com.yitong.framework.core.session.SessionConstant;
import com.alibaba.fastjson.JSON;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.Map;

/**
 * 交易上下文处理工具类
 * Created by zhuzengpeng on 2016/3/9.
 */
public class CtxUtils {

    /**
     * 交易前预处理,主要做如下事件:
     * 1、解密客户端传送过来的报文,并构造成Map格式
     * @param request
     * @return
     */
    public static Map<String, Object> transPrev(HttpServletRequest request) {
        HttpSession session = request.getSession();
        //设置返回值加密方式采用服务端生成的AES密钥加密
        session.setAttribute(SessionConstant.ENCRY_TYPE, SessionConstant.ENCRY_TYPE_2);
        //从SESSION中取得AESKEY
        String aeskey = session.getAttribute(SessionConstant.AESKEY).toString();
        //从请求报文中取得密文
        String requestBodyStr = getRequestBody(request);
        //先用BASE64解码
        byte[] requestBodyBase64 = Base64.decode(requestBodyStr);
        //在用AES解密
        String requestBodyAes = new String(AESHelper.decrypt(requestBodyBase64, aeskey));
        Map<String, Object> map = JSON.parseObject(requestBodyAes, Map.class);
        return map;
    }

    /**
     * 交易后处理
     */
    public static void transAfter() {

    }

    /**
     * 从请求对象中取得请求体报文,并转成字符串
     * @param request
     * @return
     */
    public static String getRequestBody(HttpServletRequest request) {
        // 请求原文
        StringBuffer sb = new StringBuffer();
        BufferedReader br;
        try {
            br = request.getReader();
            String str = null;
            while ((str = br.readLine()) != null) {
                sb.append(str);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return sb.toString();
    }
}
