package cn.com.yitong.framework.servlet;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;

/**
 * 从报文请求体中解析成Map
 * Created by zhuzengpeng on 2016/3/7.
 */
public class RequestUtils {

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
