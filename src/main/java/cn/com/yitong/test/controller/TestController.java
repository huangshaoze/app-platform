package cn.com.yitong.test.controller;

import cn.com.yitong.framework.core.AppConstants;
import cn.com.yitong.framework.core.encrypt.RsaHelper;
import cn.com.yitong.framework.core.session.SessionConstant;
import cn.com.yitong.framework.core.util.ResponseData;
import cn.com.yitong.framework.support.BusinessContext;
import cn.com.yitong.framework.support.CtxUtils;
import cn.com.yitong.test.support.KeyExpiredListener;
import com.wordnik.swagger.annotations.Api;
import com.wordnik.swagger.annotations.ApiOperation;
import com.wordnik.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import redis.clients.jedis.Jedis;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * @author zhuzengpeng<zzp@yitong.com.cn>
 * @2015-4-21 下午2:49:33
 */
@Controller
@RequestMapping(value = "/redis")
@Api(value = "test接口", description = "有关于测试的各种接口" )
public class TestController {

	@Autowired
	private JedisConnectionFactory jedisConnectionFactory;

	@Autowired
	private JmsTemplate jmsTemplate;

	@Autowired
	private Environment env;

	private Jedis jedis;

	@RequestMapping(value = "/testmq")
	@ResponseBody
	@ApiOperation(value = "测试消息队列", httpMethod = "GET", response = String.class, notes = "测试消息队列")
	public String testmq(@ApiParam(required = true, value  = "用户名")String username,
                         @ApiParam(required = true, value  = "优先级")Integer priority) {
		for(int i=0; i<20; i++) {
			jmsTemplate.setPriority(priority);
			jmsTemplate.convertAndSend(username + String.valueOf(i));
		}
		return "success";
	}

	private int random09() {
		int random = (int)(Math.random()*10);
		return random;
	}
//	@RequestMapping(value = "/testModelAndView")
//	@ApiOperation(value = "testModelAndView", httpMethod = "POST", response = ModelAndView.class, notes = "testModelAndView")
//	public ModelAndView testModelAndView(String username) {
//		ModelAndView view = new ModelAndView("home/index");
//		view.addObject("username", username);
//		return view;
//	}

	@RequestMapping(value = "/redispub")
	@ResponseBody
	@ApiOperation(value = "redispub", httpMethod = "POST", response = String.class, notes = "redispub")
	public String redispub( HttpServletRequest request) throws IOException {
		Jedis jedis = getJedis();
		jedis.psubscribe(new KeyExpiredListener(), "*");
		return "success";
	}

	@RequestMapping(value = "/get")
	@ResponseBody
	@ApiOperation(value = "获取REDIS值", httpMethod = "POST", response = Map.class, notes = "add user")
	public Map<String, Object> get( @ApiParam(required = false, name = "userName", value  = "userName") String userName,
									@ApiParam(required = false, name = "passwd", value  = "passwd") String passwd,
									HttpServletRequest request) throws IOException {
        //初始化数据总线
        BusinessContext ctx = new BusinessContext(request);
        //解密报文和校验报文有效性
		if(!CtxUtils.transPrev(ctx)) {
            return ctx.getResponseParams();
        }
		Map<String, Object> requestParams = ctx.getRequestParams();
		Map<String, Object> respMap = new HashMap<String, Object>();
		respMap.put("sessionId", ctx.getSession().getId());
		respMap.put("msg", "hello world!");
		respMap.put("userName", requestParams.get("userName"));
		respMap.put("passwd", requestParams.get("passwd"));
        CtxUtils.transAfter(ctx, respMap);
		return ctx.getResponseParams();
	}

	@RequestMapping(value = "/set")
	@ResponseBody
	@ApiOperation(value = "set", httpMethod = "POST", response = Map.class, notes = "set")
	public Map<String, Object> bbb(HttpServletRequest request) {
		HttpSession session = request.getSession();
		session.setAttribute("name", "zhangsan");
		session.setAttribute("sex", "男");
		session.setAttribute("age", "18");
		String sessionId = session.getId();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("sessionId", sessionId);
		return map;
	}

	@RequestMapping(value = "/testJdbcTemplateInsert")
	@ResponseBody
	@ApiOperation(value = "testJdbcTemplateInsert", httpMethod = "POST",  notes = "testJdbcTemplateInsert")
	public String testJdbcTemplateInsert() {
		String sql = "insert into ipf_interface_info(INTERFACE_ID, create_time) " +
				"values(?, ?)";
//		jdbcTemplate.update(sql, PrimaryKeyUtil.getPrimaryKey("IPF_INTERFACE_INFO"), new Date());
		return "";
	}

	@RequestMapping(value = "/webSession")
	@ResponseBody
	@ApiOperation(value = "webSession", httpMethod = "POST", response = String.class, notes = "webSession")
	public String webSession(HttpServletRequest request) {
		HttpSession session = request.getSession();
		session.setAttribute("aa", "111");
		return "success";
	}
	private Jedis getJedis(){
		if(jedis == null){
			return jedisConnectionFactory.getShardInfo().createResource();
		}
		return jedis;
	}
}
