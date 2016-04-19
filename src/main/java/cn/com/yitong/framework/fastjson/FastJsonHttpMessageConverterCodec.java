package cn.com.yitong.framework.fastjson;

import cn.com.yitong.framework.core.AppConstants;
import cn.com.yitong.framework.core.encrypt.AESHelper;
import cn.com.yitong.framework.core.encrypt.Base64;
import cn.com.yitong.framework.core.session.SessionConstant;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.support.spring.FastJsonHttpMessageConverter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.OutputStream;

/**
 * FastJson消息转换时进行加密(AES加密)
 * Created by zhuzengpeng on 2016/2/23.
 */
public class FastJsonHttpMessageConverterCodec extends FastJsonHttpMessageConverter {

    private Logger logger = LoggerFactory.getLogger(FastJsonHttpMessageConverterCodec.class);

    @Override
    protected void writeInternal(Object obj, HttpOutputMessage outputMessage) throws IOException,
            HttpMessageNotWritableException {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String clientSessionId = request.getHeader(SessionConstant.HEADERNAME_X_AUTH_TOKEN);
        if(clientSessionId != null) {//客户端调用的请求需要走加密
            writeInteernalCodec(obj, outputMessage, request);
        }else {
            super.writeInternal(obj, outputMessage);
        }
    }

    /**
     * 使用AES加密返回响应报文
     * @param obj
     * @param outputMessage
     */
    private void writeInteernalCodec(Object obj, HttpOutputMessage outputMessage, HttpServletRequest request) throws IOException {
        OutputStream out = outputMessage.getBody();
        //返回数据转成JSON字符串
        String text = JSON.toJSONString(obj, super.getFeatures());
        //判断返回报文是否是SESSION超时,如果是超时报文不加密，其余报文都要加密
        if(AppConstants.STATUS_SESSION_TIMEOUT.equals(JSON.parseObject(text).getString(AppConstants.STATUS))) {
            out.write(text.getBytes(super.getCharset()));
            return;
        }
        HttpSession session = request.getSession();
        String sessionId = session.getId();
        logger.info("MessageConverter---sessionId:{}", sessionId);
        String aeskey = session.getAttribute(SessionConstant.AESKEY).toString();
        if(session.getAttribute(SessionConstant.ENCRY_TYPE).equals(SessionConstant.ENCRY_TYPE_1)) {//采用客户端生成的AES加密(针对登陆与刷新SESSION接口)
            aeskey = session.getAttribute(SessionConstant.CLIENT_AESKEY).toString();
        }
        logger.info("MessageConverter---aesKey:{}", aeskey);
        //加密JSON字符串,并用BASE64编码
        byte[] textAesEncry = AESHelper.encrypt(text, aeskey);
        String textEncry = Base64.encode(textAesEncry);
        byte[] bytes = textEncry.getBytes(super.getCharset());
        //最终输出至前端页面
        out.write(bytes);
    }
}
