package cn.com.yitong.test.support;

import javax.servlet.*;
import java.io.IOException;

/**
 * Created by zhuzengpeng on 2015/12/3.
 */
public class TestFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        request.setAttribute("bc1", "22222222222");
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {

    }
}
