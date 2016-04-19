package cn.com.yitong.framework.servlet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;

/**
 * 针对会话的一些特殊情况统一在过滤器处理
 * 1、判断当前请求是否需要登陆,
 * 2、
 * Created by zhuzengpeng on 2016/3/16.
 */
public class SecurityFilter implements Filter {

    private final Logger logger = LoggerFactory.getLogger(SecurityFilter.class);
    /**不需登陆才能访问的URL地址*/
    private List<String> nologinurls;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        logger.info("SessionFilter doFilter");
        HttpServletRequest httpServletRequest = (HttpServletRequest)request;
        HttpSession session = httpServletRequest.getSession();
        logger.info(session.getId());
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
    }

    public List<String> getNologinurls() {
        return nologinurls;
    }

    public void setNologinurls(List<String> nologinurls) {
        this.nologinurls = nologinurls;
    }
}
