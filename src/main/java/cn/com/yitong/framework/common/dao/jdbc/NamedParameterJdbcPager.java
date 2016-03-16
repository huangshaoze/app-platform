package cn.com.yitong.framework.common.dao.jdbc;

import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import cn.com.yitong.framework.common.dao.support.Pagination;

public class NamedParameterJdbcPager {
	
	private SqlBuilder builder;
	
	private NamedParameterJdbcTemplate jdbcTemplate;
	
	public NamedParameterJdbcPager(DataSource dataSource) {
		this.jdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
	}
	
	public Pagination<Map<String, Object>> queryPage(String sql, 
			int offset, int limit) {
		return this.queryPage(sql, offset, limit, null);
	}

	public Pagination<Map<String, Object>> queryPage(String sql, 
			int offset, int limit, Map<String, Object> paramMap) {
		String countSql = builder.countSql(sql);
		String limitSql = builder.limitSql(sql, offset, limit);
		
		long totalRecords = jdbcTemplate.queryForObject(countSql, paramMap, Long.class);
		List<Map<String, Object>> items = jdbcTemplate.queryForList(limitSql, paramMap);
		
		double totalPages = Math.ceil(totalRecords * 1d / limit);
		Pagination<Map<String, Object>> page = new Pagination<Map<String, Object>>((long)totalPages, offset, limit, totalRecords, items);
		return page;
	}
	
	public SqlBuilder getBuilder() {
		return builder;
	}

	public void setBuilder(SqlBuilder builder) {
		this.builder = builder;
	}
	
}
