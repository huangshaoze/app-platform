package cn.com.yitong.interface_platform;

import cn.com.yitong.test.controller.TestController;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import junit.framework.TestCase;
import org.junit.*;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

/**
 * Created by zhuzengpeng on 2015/12/15.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration(value = "src/main/webapp")
@ContextConfiguration(locations = {"classpath:/META-INF/spring/core-context.xml",
        "classpath:/META-INF/spring/mvc-context.xml",
        "classpath:/META-INF/spring/cache-context.xml"})
public class SpringTest {

    @Autowired
    private WebApplicationContext wac;
    private MockMvc mockMvc;

    @Before
    public void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }

    /**
     * mockMvc.perform执行一个请求；
     * MockMvcRequestBuilders.get("/redis/get")构造一个请求
     * ResultActions.andExpect添加执行完成后的断言
     * ResultActions.andDo添加一个结果处理器，表示要对结果做点什么事情，比如此处使用MockMvcResultHandlers.print()输出整个响应结果信息。
     * ResultActions.andReturn表示执行完成后返回相应的结果。
     * @throws Exception
     */
    @org.junit.Test
    public void testHttpGet() throws Exception {
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/redis/testModelAndView?username=100"))
                .andExpect(MockMvcResultMatchers.view().name("home/index"))//验证viewName
                .andExpect(MockMvcResultMatchers.forwardedUrl("/WEB-INF/views/home/index.jsp"))//验证视图渲染时forward到的jsp
                .andExpect(MockMvcResultMatchers.status().isOk())//验证状态码
            .andExpect(MockMvcResultMatchers.model().attributeExists("username"))
            .andDo(MockMvcResultHandlers.print())//输出MvcResult到控制台
            .andReturn();
    //自定义断言
    Assert.assertNotNull(result.getModelAndView().getModel().get("username").equals("100"));
}

    @org.junit.Test
    public void testHttpPost() throws Exception {
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/redis/get").param("a", "100"))
                .andExpect(MockMvcResultMatchers.handler().handlerType(TestController.class))//验证执行的控制器类型
                .andExpect(MockMvcResultMatchers.handler().methodName("get"))//验证执行的控制器方法名
                .andDo(MockMvcResultHandlers.print())
                .andReturn();
        //自定义断言
        Assert.assertNotNull(result.getResponse());
    }

    /**
     * 测试文件上传
     */
//    @org.junit.Test
//    public void testFileUpload() throws Exception {
//        byte[] bytes = new byte[] {1, 2};
//        mockMvc.perform(MockMvcRequestBuilders.fileUpload("/user/{id}/icon", 1L).file("icon", bytes)) //执行文件上传
//                .andExpect(MockMvcResultMatchers.model().attribute("icon", bytes)); //验证属性相等性
//    }

    /**
     * 测试请求返回结果是JSON字符串的情况
     */
    @org.junit.Test
    public void testResponseJson() throws Exception {
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/redis/get").param("a", "100"))
                .andExpect(MockMvcResultMatchers.content().contentType("application/json;charset=UTF-8")) //验证响应contentType
                .andDo(MockMvcResultHandlers.print())
                .andReturn();
        //自定义断言
        String retJson = result.getResponse().getContentAsString();
        JSONObject jsonObject = JSON.parseObject(retJson);
        Assert.assertEquals(    jsonObject.getString("a"), "100");
    }
}
