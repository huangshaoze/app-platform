package cn.com.yitong.test.controller;

import cn.com.yitong.framework.core.encrypt.RsaHelper;
import cn.com.yitong.framework.core.session.SessionConstant;
import cn.com.yitong.framework.core.util.ResponseData;
import cn.com.yitong.framework.support.CtxUtils;
import cn.com.yitong.test.support.KeyExpiredListener;
import com.wordnik.swagger.annotations.Api;
import com.wordnik.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
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
	private Environment env;

	private Jedis jedis;

	@RequestMapping(value = "/testModelAndView")
	public ModelAndView testModelAndView(String username) {
		ModelAndView view = new ModelAndView("home/index");
		view.addObject("username", username);
		return view;
	}

	@RequestMapping(value = "/redispub")
	@ResponseBody
	public String redispub( HttpServletRequest request) throws IOException {
		Jedis jedis = getJedis();
		jedis.psubscribe(new KeyExpiredListener(), "*");
		return "success";
	}

	@RequestMapping(value = "/get")
	@ResponseBody
	@ApiOperation(value = "获取REDIS值", httpMethod = "POST", response = Map.class, notes = "add user")
	public Map<String, Object> get( HttpServletRequest request) throws IOException {
		Map<String, Object> requestParams = CtxUtils.transPrev(request);
		Map<String, Object> map = new HashMap<String, Object>();
		HttpSession session = request.getSession();
		String sessionId = session.getId();
		session.setAttribute(SessionConstant.ENCRY_TYPE, SessionConstant.ENCRY_TYPE_2);
		map.put("sessionId", sessionId);
		map.put("name", "hello world!");
		return map;
	}
	
	@RequestMapping(value = "/set")
	@ResponseBody
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
	
	@RequestMapping(value = "/dto", headers="accept")
	@ResponseBody
	public UserDto testDto(@PathVariable(value="aa") String t1,
			@RequestHeader(value="bb") String t2, String t34, String t46) {
		UserDto t = new UserDto();
		t.setName("zzp");
		t.setPasswd("111111111");
		return t;
	}
	
	@RequestMapping(value = "/dtoList")
	@ResponseBody
	public List<UserDto> dtoList() {
		UserDto t1 = new UserDto();
		t1.setName("zzp");
		t1.setPasswd("111111111");
		UserDto t2 = new UserDto();
		t2.setName("aaa");
		t2.setPasswd("22222");
		List<UserDto> list = new ArrayList<UserDto>();
		list.add(t1);
		list.add(t2);
		return list;
	}
	
	@RequestMapping(value = "/testJdbcTemplateInsert")
	@ResponseBody
	public ResponseData testJdbcTemplateInsert() {
		String sql = "insert into ipf_interface_info(INTERFACE_ID, create_time) " +
				"values(?, ?)";
//		jdbcTemplate.update(sql, PrimaryKeyUtil.getPrimaryKey("IPF_INTERFACE_INFO"), new Date());
		return ResponseData.SUCCESS_NO_DATA;
	}

	private Jedis getJedis(){
		if(jedis == null){
			return jedisConnectionFactory.getShardInfo().createResource();
		}
		return jedis;
	}
}
