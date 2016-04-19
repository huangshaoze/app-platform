package cn.com.yitong.framework.support;

import cn.com.yitong.framework.core.AppConstants;
import cn.com.yitong.framework.core.encrypt.AESHelper;
import cn.com.yitong.framework.core.encrypt.Base64;
import cn.com.yitong.framework.core.session.SessionConstant;
import com.alibaba.fastjson.JSON;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

/**
 * 交易上下文处理工具类
 * Created by zhuzengpeng on 2016/3/9.
 */
public class CtxUtils {

    private static final Logger logger = LoggerFactory.getLogger(CtxUtils.class);
    /**
     * 交易前预处理,主要做如下事:
     * 1、判断客户端传过来的SESSIONID是否过期
     * 2、解密客户端传送过来的报文,并构造成Map格式,如果是浏览器直接访问的则不解密直接从请求对象中取参数
     * 3、根据SWAGGER注解校验报文有效性
     * @param ctx
     * @return
     */
    public static boolean transPrev(BusinessContext ctx) {
        //加载请求参数
        if(ctx.initRequestParams()) {
            //校验请求报文合法性
            return ctx.checkRequestParams();
        }
        return false;
    }

    /**
     * 交易后处理
     */
    public static void transAfter(BusinessContext ctx, Map<String, Object> map) {
        ctx.getResponseParams().put(AppConstants.STATUS, AppConstants.STATUS_OK);
        ctx.getResponseParams().putAll(map);
    }



}
