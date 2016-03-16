/*
 * Copyright 2010-2011 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package cn.com.yitong.framework.common.dao.key;

public class CacheValue {
	private long minVal;
	private long maxVal;

	/**
	 * 默认构造函数
	 */
	public CacheValue() {
		this.minVal = 0L;
		this.maxVal = 0L;
	}

	//11
	public String toString() {
		return "{ minVal = " + this.minVal + " || maxVal = " + this.maxVal + " }";
	}

	/**
	 * @return minVal
	 */
	public long getMinVal() {
		return minVal;
	}

	/**
	 * 
	 * @param minVal 最小值
	 */
	public void setMinVal(long minVal) {
		this.minVal = minVal;
	}

	public long getMaxVal() {
		return maxVal;
	}

	public void setMaxVal(long maxVal) {
		this.maxVal = maxVal;
	}
}
