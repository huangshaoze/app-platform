package cn.com.yitong.framework.core.encrypt;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

/**
 * AES加密工具类
 * Created by zhuzengpeng on 2016/2/26.
 */
public class AESHelper {

    private static final String KEY_ALGORITHM = "AES";
    private static final String DEFAULT_CIPHER_ALGORITHM = "AES/ECB/PKCS5Padding";

    /**
     * 生成一个随机的AESKEY,格式：16位的消息ID+16位UUID
     * @return
     */
    public static String generateAeskey() {
        String msgId = "000" + System.currentTimeMillis();
        String uuid = UUID.randomUUID().toString().replaceAll("-", "").substring(0,16);
        return msgId + uuid;
    }

    /**
     * @method main
     * @throws
     * @since v1.0
     */

    public static byte[] encrypt(String data, String password)  {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(password.getBytes(), KEY_ALGORITHM);
            // 实例化
            Cipher cipher = Cipher.getInstance(DEFAULT_CIPHER_ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            // 执行操作
            return cipher.doFinal(data.getBytes());
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (NoSuchPaddingException e) {
            e.printStackTrace();
        } catch (BadPaddingException e) {
            e.printStackTrace();
        } catch (IllegalBlockSizeException e) {
            e.printStackTrace();
        } catch (InvalidKeyException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static byte[] decrypt(byte[] data, String password) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(password.getBytes(), KEY_ALGORITHM);
            // 实例化
            Cipher cipher = Cipher.getInstance(DEFAULT_CIPHER_ALGORITHM);
            // 使用密钥初始化，设置为解密模式
            cipher.init(Cipher.DECRYPT_MODE, keySpec);
            // 执行操作
            return cipher.doFinal(data);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (NoSuchPaddingException e) {
            e.printStackTrace();
        } catch (BadPaddingException e) {
            e.printStackTrace();
        } catch (IllegalBlockSizeException e) {
            e.printStackTrace();
        } catch (InvalidKeyException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


    public static void main(String[] args) {
//        try {
//            String aeskey = AESHelper.generateAeskey();
//            System.out.println("aeskey:" + aeskey);
//            byte[] aa = AESHelper.encrypt("1111aaa朱", aeskey);
//            String aa64 = Base64.encode(aa);
//            System.out.println(aa64);
//            byte[] bb = AESHelper.decrypt(Base64.decode(aa64), aeskey);
//            System.out.println(new String(bb));
//            System.out.println("------------------");
//            byte[] tt = AESHelper.decrypt(Base64.decode("+iYNl6RaVJlaWk9Hx5llhwbjKKqKG/x/NlvU8Z1jb9zP/qZ2yef1ht2Gx26ZyCV1"), "20141212112740.27c521a72-0817-45");
//            System.out.println(new String(tt));
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
        String content = "{name:'zhangsan', sex:'16', school:'李四'}";
        String password = "20141212112740.22014121211274011";
        byte[] encryptResult = encrypt(content, password);//加密
        System.out.println("***********************************************");
        String encryptResultStr = Base64.encode(encryptResult);
        System.out.println("先AES然后BASE64加密后：" + encryptResultStr);
        byte[] decryptFrom = Base64.decode(encryptResultStr);
        byte[] decryptResult = decrypt(decryptFrom,password);//解码
        System.out.println("解密后：" + new String(decryptResult));
    }
}
