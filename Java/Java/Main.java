import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class Main {
    public void readFileLine(String path) {
        try (
                BufferedReader br = new BufferedReader(new FileReader(path))) {
            String line;
            StringBuffer sb = new StringBuffer();
            while ((line = br.readLine()) != null) {
                sb.append(line);
            }
            System.out.println(sb.toString());

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        Main main = new Main();
        main.readFileLine("aa.txt");
    }
}
