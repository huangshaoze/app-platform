package cn.com.yitong.framework.common.dao.jdbc.support;

import cn.com.yitong.framework.common.dao.jdbc.SqlBuilder;

public class NotSupportSqlBuilder implements SqlBuilder {

	@Override
	public String countSql(String sql) {
		throw new RuntimeException("SQL分之只支持mysql和oracle");
	}

	@Override
	public String limitSql(String sql, int offset, int count) {
		throw new RuntimeException("SQL分之只支持mysql和oracle");
	}

}
