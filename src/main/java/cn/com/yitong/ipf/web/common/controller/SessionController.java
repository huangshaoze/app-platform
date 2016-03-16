package cn.com.yitong.ipf.web.common.controller;

import cn.com.yitong.framework.core.encrypt.AESHelper;
import cn.com.yitong.framework.core.encrypt.Base64;
import cn.com.yitong.framework.core.encrypt.RsaHelper;
import cn.com.yitong.framework.core.session.SessionConstant;
import cn.com.yitong.framework.support.CtxUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by zhuzengpeng on 2016/3/7.
 */
@RestController
@RequestMapping("/session")
public class SessionController {

    Logger logger = LoggerFactory.getLogger(SessionController.class);

    /**
     * 1、客户端在首次与服务端交互时,先调此接口取得AES密钥
     * 2、客户端请求时自己生成一个AESKEY-1(MSGID+设备UUID)并用RSA加密,服务端RSA解密后得到AESKEY-1
     * 3、服务端自己在生成一个AESKEY-2,并与SESSION绑定，然后用AESKEY-1加密AESKEY-2后BASE64编码传送至客户端
     * @param request
     * @return
     */
    @RequestMapping(value = "refreshSession")
    public Map<String, Object> refreshSession(HttpServletRequest request) throws Exception {
        Map<String, Object> rst = new HashMap<String, Object>();
        //从请求报文中取得密文解密,然后把请求报文解析成Map
        String requestBodyStr = CtxUtils.getRequestBody(request);
        logger.info("刷新SESSION接口,取得的加密前请求报文;{}", requestBodyStr);
        //解密出来后即是客户端生成的AESKEY-1
        String msg = RsaHelper.decrypt(requestBodyStr);
        logger.info("刷新SESSION接口,RSA解密后报文;{}", msg);
        //构建返回报文
        HttpSession session = request.getSession();
        String sessionId = session.getId();
        //新生成一个aeskey与SESSION绑定，并加密传送至客户端
        String aeskey = AESHelper.generateAeskey();
        session.setAttribute(SessionConstant.AESKEY, aeskey);
        session.setAttribute(SessionConstant.CLIENT_AESKEY, msg);
        session.setAttribute(SessionConstant.ENCRY_TYPE, SessionConstant.ENCRY_TYPE_1);
        rst.put(SessionConstant.SESSIONID, sessionId);
        rst.put(SessionConstant.AESKEY, aeskey);
        return rst;
    }
}
