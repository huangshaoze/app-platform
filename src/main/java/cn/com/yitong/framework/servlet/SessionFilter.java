package cn.com.yitong.framework.servlet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.*;
import java.io.IOException;

/**
 * 针对会话的一些特殊情况统一在过滤器处理
 * 1、判断当前请求是否需要登陆,
 * 2、
 * Created by zhuzengpeng on 2016/3/16.
 */
public class SessionFilter implements Filter {

    private final Logger logger = LoggerFactory.getLogger(SessionFilter.class);

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        logger.info("SessionFilter doFilter");
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
    }
}
