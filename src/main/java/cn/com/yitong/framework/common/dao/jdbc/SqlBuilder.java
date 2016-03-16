package cn.com.yitong.framework.common.dao.jdbc;

public interface SqlBuilder {
	
	/**
	 * 创建count统计sql语句
	 * 
	 * @param sql
	 * @return
	 */
	public String countSql(String sql);
	
	/**
	 * 创建limit sql语句
	 * 
	 * @param sql
	 * @param offset
	 * @param count
	 * @return
	 */
	public String limitSql(String sql, int offset, int count);
}
