package cn.com.yitong.test.controller;

import com.wordnik.swagger.annotations.Api;
import com.wordnik.swagger.annotations.ApiOperation;
import com.wordnik.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by zhuzengpeng on 2015/11/13.
 */
@Controller
@RequestMapping(value =  "/mdm")
@Api(value = "mdm相关接口", description = "有关于MDM的各种接口" )
public class ProfileController {

    private Logger logger = LoggerFactory.getLogger(ProfileController.class);

    @RequestMapping(value = "/ca", method = RequestMethod.POST)
    @ResponseBody
    @ApiOperation(value = "获取CA值", httpMethod = "POST", response = Map.class, notes = "queryca")
    public Map<String, Object> ca(@ApiParam(required = true, name = "name", value = "用户名")  @RequestParam(value = "name") String name,
                                  @ApiParam(required = true, name = "sex", value = "性别") @RequestParam(value = "sex") String sex) throws IOException {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("name", name);
        map.put("sex", sex);
        return map;
    }

    @RequestMapping(value = "/enroll", method = RequestMethod.POST)
    @ResponseBody
    @ApiOperation(value = "获取enroll值", httpMethod = "POST", response = Map.class, notes = "queryenroll")
    public Map<String, Object> enroll(HttpServletResponse response) throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("c", "333");
        map.put("d", "444");
        return map;
    }

    @RequestMapping(value = "/profile", method = RequestMethod.POST)
    @ResponseBody
    @ApiOperation(value = "获取profile值", httpMethod = "POST", response = Map.class, notes = "queryprofile")
    public Map<String, Object> profile(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("e", "555");
        map.put("f", "666");
        return map;
    }
}
