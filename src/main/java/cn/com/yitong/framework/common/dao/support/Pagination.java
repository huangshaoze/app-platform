package cn.com.yitong.framework.common.dao.support;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import com.github.pagehelper.Page;

@SuppressWarnings("serial")
public class Pagination<E> implements Serializable, Iterable<E> {

	protected List<E> result;

	private int offset;
	
	protected int limit;
	
	protected long currPage;

	protected long totalPages;

	protected long totalRecords = 0;

	public Pagination(long totalPages, int offset, int limit, long totalRecords) {
		this(totalPages, offset, limit, totalRecords, new ArrayList<E>(0));
	}

	public Pagination(long totalPages, int offset, int limit, long totalRecords,List<E> result) {
		this((offset / limit) + 1, totalPages, offset, limit, totalRecords, result);
	}
	
	public Pagination(int currPage, long totalPages, int offset, int limit, long totalRecords,List<E> result) {
		if(limit <= 0) throw new IllegalArgumentException("[pageSize] must great than zero");
		this.limit = limit;
		this.offset = offset;
		this.currPage = currPage;
		
		if(totalPages == 0)
			this.totalPages = 1;
		else
			this.totalPages = totalPages;
		
		this.totalRecords = totalRecords;
		setResult(result);
	}

	/**
	 * MYBATIS分页查询结果转成EXTJS容易解析的格式
	 */
	public Pagination(Page<E> pageList) {
		this.limit = pageList.getPageSize();
		this.offset = pageList.getStartRow();
		this.currPage = pageList.getPageNum();
		this.totalPages = pageList.getPages();
		this.totalRecords = pageList.getTotal();
		setResult(pageList.getResult());
	}
	
	public void setResult(List<E> elements) {
		if (elements == null)
			throw new IllegalArgumentException("'result' must be not null");
		this.result = elements;
	}
	
	public int getOffset() {
		return offset;
	}

	public int getLimit() {
		return limit;
	}
	
	public List<E> getResult() {
		return result;
	}

	public long getCurrPage() {
		return currPage;
	}

	public long getTotalPages() {
		return totalPages;
	}

	public long getTotalRecords() {
		return totalRecords;
	}
	
	@SuppressWarnings("unchecked")
	public Iterator<E> iterator() {
		return (Iterator<E>) (result == null ? Collections.emptyList().iterator() : result.iterator());
	}
}
