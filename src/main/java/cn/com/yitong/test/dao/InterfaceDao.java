package cn.com.yitong.test.dao;

import cn.com.yitong.framework.core.support.mybatis.MyBatisRepository;

import java.util.List;
import java.util.Map;

/**
 * @author zhuzengpeng<zzp@yitong.com.cn>
 */
@MyBatisRepository
public interface InterfaceDao {

	void insert(Map<String, Object> map);

}
