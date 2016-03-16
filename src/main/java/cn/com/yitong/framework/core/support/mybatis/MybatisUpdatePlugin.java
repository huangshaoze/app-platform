package cn.com.yitong.framework.core.support.mybatis;

import java.io.Serializable;
import java.util.Properties;

import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.apache.ibatis.plugin.Signature;

/**
 * @author zhuzengpeng<zzp@yitong.com.cn>
 * @date 2015-4-16 下午2:11:23
 */
@Intercepts({
	@Signature(type= Executor.class, method = "query", args = {MappedStatement.class, Object.class})
})
public class MybatisUpdatePlugin  implements Interceptor, Serializable {

	private static final long serialVersionUID = 1L;

	@Override
	public Object intercept(Invocation invocation) throws Throwable {
		System.out.println("MybatisUpdatePlugin---intercept");
		Object object = invocation.proceed();
		return object;
	}

	@Override
	public Object plugin(Object target) {
		System.out.println("MybatisUpdatePlugin---plugin");
		return Plugin.wrap(target, this);
	}

	@Override
	public void setProperties(Properties properties) {
		System.out.println("MybatisUpdatePlugin---setProperties");
	}
	
}
