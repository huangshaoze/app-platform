package cn.com.yitong.framework.common.uuid;

import com.fasterxml.uuid.EthernetAddress;
import com.fasterxml.uuid.Generators;
import com.fasterxml.uuid.impl.TimeBasedGenerator;


public class StrongUuidGenerator {

	protected static TimeBasedGenerator timeBasedGenerator;

	static {
		timeBasedGenerator = Generators.timeBasedGenerator(EthernetAddress.fromInterface());
	}


	public static String getNextId() {
		return timeBasedGenerator.generate().toString();
	}
}
