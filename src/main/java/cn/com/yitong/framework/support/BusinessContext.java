package cn.com.yitong.framework.support;

import cn.com.yitong.framework.core.AppConstants;
import cn.com.yitong.framework.core.encrypt.AESHelper;
import cn.com.yitong.framework.core.encrypt.Base64;
import cn.com.yitong.framework.core.session.SessionConstant;
import cn.com.yitong.framework.servlet.RequestUtils;
import com.alibaba.fastjson.JSON;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.ReflectionUtils;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

/**
 * 业务总线,一个从前端过来的请求到处理结束的相关的数据统都在这里面
 * Created by zhuzengpeng on 2016/4/15.
 */
public class BusinessContext {

    private static final Logger logger = LoggerFactory.getLogger(BusinessContext.class);

    private HttpServletRequest request;
    private HttpSession session;
    /**请求参数区域*/
    private Map<String, Object> requestParams = new HashMap<String, Object>();

    /**响应参数区域*/
    private Map<String, Object> responseParams = new HashMap<String, Object>();

    public BusinessContext(HttpServletRequest request) {
        this.request = request;
        this.session = request.getSession();
    }

    public HttpServletRequest getRequest() {
        return request;
    }

    public HttpSession getSession() {
        return session;
    }

    public Map<String, Object> getRequestParams() {
        return requestParams;
    }

    public void setRequestParamsMap(Map<String, Object> requestParams) {
        this.requestParams = requestParams;
    }

    public Map<String, Object> getResponseParams() {
        return responseParams;
    }

    /**
     * 从请求报文中解析出请求参数
     * @return 成功返回true，异常返回false
     */
    public boolean initRequestParams() {
        String clientSessionId = request.getHeader(SessionConstant.HEADERNAME_X_AUTH_TOKEN);
        if(clientSessionId == null) {//请求头不带x-auth-token说明是浏览器请求的
            parserUrlParams();
            return true;
        }
        String serverSessionId = session.getId();
        if(!clientSessionId.equals(serverSessionId)) {//session超时
            logger.info("session已超时");
            responseParams.put(AppConstants.STATUS, AppConstants.STATUS_SESSION_TIMEOUT);
            return false;
        }
        //设置返回值加密方式采用服务端生成的AES密钥加密
        session.setAttribute(SessionConstant.ENCRY_TYPE, SessionConstant.ENCRY_TYPE_2);
        //从SESSION中取得AESKEY
        String aeskey = session.getAttribute(SessionConstant.AESKEY).toString();
        //从请求报文中取得密文
        String requestBodyStr = RequestUtils.getRequestBody(request);
        //先用BASE64解码
        byte[] requestBodyBase64 = Base64.decode(requestBodyStr);
        //在用AES解密
        String requestBodyAes = new String(AESHelper.decrypt(requestBodyBase64, aeskey));
        requestParams.putAll(JSON.parseObject(requestBodyAes, Map.class));
        return true;
    }

    /**
     * 校验请求参数有效性(暂未实现)
     * @return
     */
    public boolean checkRequestParams() {
//        ReflectionUtils.
        return true;
    }

    /**
     * 解析request中的参数,并放在总线的请求参数中
     * @return
     */
    @SuppressWarnings({ "rawtypes", "unchecked" })
    private boolean parserUrlParams() {
        Enumeration names = request.getParameterNames();
        while (names.hasMoreElements()) {
            String name = (String) names.nextElement();
            String value = request.getParameter(name);
            if (StringUtils.hasText(value)) {
                requestParams.put(name, value);
            }
        }
        return true;
    }

}
