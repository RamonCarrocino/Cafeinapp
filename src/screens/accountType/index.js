import * as Yup from 'yup';
import {useFormik} from 'formik';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, {useCallback} from 'react';
import {
  KeyboardAvoidingView,
  StatusBar,
  ScrollView,
  View,
  Platform,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import styles from './styles';
import {onError} from '../../helpers';
import {Button} from '../../components/molecules';
import {colors, config, yup} from '../../assets/others';
import {Text, Spacer, Touchable} from '../../components/atoms';

const INITIAL_VALUES = {
  accountType: '',
  terms: '',
};

const AccountType = ({navigation}) => {
  const nextStep = useCallback(
    async values => {
      try {
        navigation.navigate('register', values);
      } catch (error) {
        console.log(error);
        onError(error);
      }
    },
    [navigation],
  );

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    isSubmitting,
    touched,
    errors,
    values,
  } = useFormik({
    onSubmit: nextStep,
    validationSchema,
    initialValues: INITIAL_VALUES,
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={Platform.OS === 'android' ? 'black' : 'white'}
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />

      <KeyboardAvoidingView style={styles.keyboard} behavior={config.behavior}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <View style={styles.main}>
              <Spacer />
              <View>
                <Text format="title" style={{textAlign: 'center'}}>
                  <Spacer />
                  Escolha o tipo de conta que {'\n'} deseja criar:
                </Text>

                <Spacer />

                {/* options */}
                <View>
                  <Touchable onPress={() => setFieldValue('accountType', 0)}>
                    <View style={styles.option}>
                      <View
                        style={[
                          {
                            backgroundColor:
                              values.accountType === 0 ? '#CC9424' : 'white',
                          },
                          styles.radioBtn,
                        ]}
                      />

                      <Text format="subtitle">
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                          Conta pessoal:
                        </Text>{' '}
                        sou um apreciador de cafés!
                      </Text>
                    </View>
                  </Touchable>

                  <Spacer size="smaller" />

                  <Touchable onPress={() => setFieldValue('accountType', 1)}>
                    <View style={styles.option}>
                      <View
                        style={[
                          {
                            backgroundColor:
                              values.accountType === 1 ? '#CC9424' : 'white',
                          },
                          styles.radioBtn,
                        ]}
                      />

                      <Text format="subtitle">
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                          Conta comercial:
                        </Text>{' '}
                        sou uma empresa!
                      </Text>
                    </View>
                  </Touchable>
                </View>
                {touched.accountType && errors.accountType && (
                  <Text style={styles.error} format="error">
                    {errors.accountType}
                  </Text>
                )}
              </View>

              <Spacer />

              <View style={styles.footer}>
                <View style={styles.containerTerms}>
                  <ScrollView
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={styles.scrollTerms}>
                    <Text>{TERMS}</Text>
                    <Spacer />
                  </ScrollView>
                </View>

                <View style={styles.option}>
                  <CheckBox
                    value={values.terms}
                    onValueChange={e => setFieldValue('terms', e)}
                    style={styles.checkbox}
                    tintColors={{true: '#CC9424', false: '#CC9424'}}
                  />

                  <Text format="subtitle">
                    Concordo com termos de uso e politicas de dados
                  </Text>
                </View>
                {touched.terms && errors.terms && (
                  <Text style={styles.error} format="error">
                    {errors.terms}
                  </Text>
                )}
                <Spacer />

                <Button
                  text="Próximo"
                  disabled={isSubmitting}
                  onPress={handleSubmit}
                  loading={isSubmitting}
                />
                <Spacer />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const validationSchema = Yup.object({
  accountType: Yup.number(yup.number).required('Escolha um tipo de conta'),
  terms: Yup.boolean().required(
    'Você precisa aceitar os termos para prosseguir',
  ),
});

export default AccountType;

const TERMS = `
TERMOS DE USO
Cafeinapp termos de uso

Bem-vindo ao Cafeinapp! O Cafeinapp é um aplicativo de caráter informativo que se destina a auxiliar seus usuários a conhecer novos cafés, cafeteria e registrar suas experiencias com cafés. Estes Termos de Uso regem o uso do aplicativo Cafeinapp.

O Aplicativo Cafeinapp (doravante denominado Aplicativo) é desenvolvido e mantido pela Cafeinapp portal de soluções em café LTDA, CNPJ 47.563.415/0001-37 (doravante denominada Cafeinapp), empresa brasileira, que disponibiliza o acesso ao Aplicativo de forma gratuita. O Aplicativo tem caráter informativo e se destinada a auxiliar os usuários do Aplicativo (doravante denominado Usuário) a conhecer novos cafés, cafeteria e registrar suas experiencias com cafés.

Aceitação dos Termos de Uso: Ao realizar o download e usar os serviços e recursos do aplicativo, aceitar os termos de uso ao clicar no botão “aceito”, completar seu cadastro para uso, o usuário afirma que: 1. Leu, entendeu e concorda em se vincular a esse termo de uso; 2. Tem idade legal para estar vinculado, contratualmente, a esse termo de uso do Cafeinapp; 3. Tem a autoridade para se vincular a esse termo de uso pessoalmente ou em nome da entidade a qual entrou como usuário e vincular essa entidade, contratualmente, a esse termo de uso. O Usuário concorda com os termos deste documento ao usar de qualquer forma o Aplicativo ou sistemas associados. Caso o Usuário não concorde com estes Termos de Uso, não deve usar o Aplicativo ou os serviços associados a ele. O uso de qualquer funcionalidade do aplicativo implica na integral aceitação destes termos.

Alterações aos Termos de uso: Estes Termos de Uso poderão ser atualizadas ou alteradas pela Cafeinapp a qualquer momento. As alterações serão notificadas ao Usuário através do Aplicativo e/ou por e-mail. As alterações entrarão em vigor imediatamente. Depois de publicadas as alterações, a continuação do uso do Aplicativo constitui a concordância do Usuário com os novos termos.

Privacidade: Informações pessoais que identifiquem os usuários estão sujeitas à nossa Política de privacidade. Consulte a Política de privacidade para entender nossas práticas.

Preferências de comunicação: Ao utilizar o Aplicativo, você consente receber comunicados por meios eletrônicos da Cafeinapp relacionados à sua conta. A comunicação incluirá o envio de e-mails, para o endereço de e-mail informado durante a inscrição, a publicação de comunicados no Aplicativo, e poderá incluir avisos relacionados à sua conta (autorizações de pagamento, mudanças de senha ou forma de pagamento, confirmações e outras informações relativas a transações). Tal comunicação constituirá parte do seu relacionamento com a Cafeinapp. Você concorda que quaisquer avisos, contratos, divulgações ou outras comunicações enviadas pela Cafeinapp, para você eletronicamente, satisfazem os requisitos legais de comunicação, incluindo o requisito de que tais comunicações sejam por escrito. Você também concorda em receber outras comunicações da Cafeinapp, como boletins informativos sobre novas funcionalidades e conteúdo da Cafeinapp, ofertas especiais, promoções e pesquisas de mercado, seja por e-mail ou outros meios de comunicação.

 

Sobre o Uso do Aplicativo
 

Para fazer uso do Aplicativo o Usuário deverá ter e operar um smartphone Android ou Apple, compatíveis com as necessidades de hardware e software para a sua perfeita execução.

O Aplicativo é disponibilizado somente através da loja de aplicativos Google Play e App Store.

O login no Aplicativo é necessário para acessar todas as suas funcionalidades e serviços.

Algumas funcionalidades do Aplicativo, como login, backup, sincronização, entre outras, estarão somente disponíveis se houver uma conexão ativa com a Internet, que é de responsabilidade do Usuário, assim como os custos de utilização de Internet.

O Aplicativo dispõe de diversos perfis de cafés pré-configurados que podem ser acessados através da identificação de rótulos, por foto ou por entrada do nome do café, por texto.

A criação e indicação de atualização de um perfil de café, são incentivadas para que os usuários apresentem essas informações, caso não encontre o produto desejado, e será validado e incluídos a base de dados pela administração do aplicativo, para posterior disponibilização.

Usuário compreende que o Aplicativo é uma ferramenta informativa que realiza a busca de cafés, cafeterias e registra as impressões dos cafés consumidos; Que o aplicativo não é 100% confiável, pois às vezes os rótulos dos produtos podem não ser corretamente digitalizados devido a erros de uso do usuário, impressões com falta de informações, desgastes na impressão do rótulo, má iluminação, câmera do smartphone danificada, ou outros motivos técnicos ou não técnicos alheios ao Aplicativo; Que os fabricantes de podem alterar os ingredientes e embalagens de seu produto, dificultando ou impossibilitando a identificação do produto especifico que procura. Mesmo assim a Cafeinapp trabalhará para solucionar tal imprevisto o mais breve possível.

O Usuário concorda que o Aplicativo e seus criadores não são responsáveis por quaisquer erros no aplicativo ou na embalagem e danos que possam resultar do uso incorreto do aplicativo.

A Cafeinapp se reserva o direito de suspender ou bloquear o acesso ao Aplicativo sem aviso prévio, assim como disponibilizar informações, quando solicitadas por ordem judicial.

O Usuário pode encerrar a utilização do Aplicativo a qualquer momento e por qualquer motivo. Não estando obrigado a proceder a qualquer tempo a comunicação à Cafeinapp.

 

Links Externos
 

O Aplicativo ou o site do aplicativo podem vir a conter links para outros websites e aplicativos. Estes websites e aplicativos estão fora do controle da Cafeinapp, sendo que o acesso a estes e/ou a permanência nestes serão por conta e risco do usuário.

Todos os direitos autorais e marcas comerciais acessíveis através dos links disponibilizados no Aplicativo ou em seu site são de propriedade dos respectivos donos dos websites ou dos seus licenciadores.

 

Sobre o Funcionamento do Aplicativo e Segurança
 

A Cafeinapp desenvolveu o Aplicativo baseado em requisitos de segurança atuais para proteger os dados do Usuário, no entanto o Usuário concorda que é responsável pela segurança dos dados em seu dispositivo, sendo obrigação do Usuário manter seu dispositivo atualizado e seguro, isentando a Cafeinapp de responsabilidades sobre a ação de softwares mal-intencionados no dispositivo do Usuário ou na rede de Internet que utilizou para se conectar aos servidores da Cafeinapp.

Apesar da compatibilidade do Aplicativo com a maioria dos dispositivos, por questões técnicas, a Cafeinapp não garante o correto funcionamento da câmera e das demais funcionalidades do Aplicativo, visto que dependem de hardware e software desenvolvido por terceiros.

 

Sobre o Backup e Sincronização
 

Os serviços de Backup, e Sincronização de perfis estão condicionados à disponibilidade de uma conexão ativa à Internet entre o dispositivo onde o Aplicativo está instalado e os Servidores da Cafeinapp. Sem esta conexão, estes serviços não ocorrem. Conexões entre o Aplicativo e os Servidores da Cafeinapp podem estar sujeitas a políticas locais e/ou internacionais e mantidas por terceiros.

O serviço de Backup se dá de forma automatizada após o login do Usuário no Aplicativo. Sem o login o backup dos dados não ocorre.

O serviço de Backup ocorre através do envio, de forma automatizada, dos dados de perfil do Usuário para os Servidores da Cafeinapp.

O serviço de Sincronização ocorre de forma automatizada, quando o Usuário fizer o login no Aplicativo. Este serviço é condicionado à disponibilidade de uma conexão ativa à Internet.

 

Sobre a Disponibilização do Aplicativo e Serviços Associados
 

A Cafeinapp se reserva o direito de modificar, suspender ou encerrar a disponibilização do Aplicativo e dos serviços associados a ele, sem a necessidade de aviso prévio.

 

Termos de isenção de garantias e limitações de responsabilidade
 

O APLICATIVO LOOMOS E TODOS OS CONTEÚDOS E SOFTWARES ASSOCIADOS, ASSIM COMO QUAISQUER OUTROS RECURSOS OU FUNCIONALIDADES ASSOCIADAS AO SERVIÇO DO APLICATIVO, SÃO FORNECIDOS “NO SEU ESTADO ATUAL” E “CONFORME DISPONIBILIDADE”, COM TODAS AS FALHAS E SEM GARANTIAS DE QUALQUER ESPÉCIE. A CAFEINAPP NÃO FAZ AFIRMAÇÕES OU DÁ GARANTIAS DE QUALQUER TIPO DE QUE SEU USO DO SERVIÇO DO APLICATIVO SERÁ CONTÍNUO OU LIVRE DE ERROS. A CAFEINAPP ISENTA-SE ESPECIFICAMENTE DE QUALQUER RESPONSABILIDADE PELO USO DO APLICATIVO CONTRÁRIO AO DISPOSTO NESTES TERMOS DE USO. ATÉ A MÁXIMA EXTENSÃO PERMITIDA POR LEI, EM NENHUM EVENTO A CAFEINAPP, SUAS SUBSIDIÁRIAS, AFILIADAS OU SEUS ACIONISTAS, DIRETORES, EXECUTIVOS, FUNCIONÁRIOS OU LICENCIADORES DEVERÃO SER RESPONSABILIZADOS (SUBSIDIARIAMENTE OU SOLIDARIAMENTE) EM RELAÇÃO A VOCÊ POR DANOS ESPECIAIS, INCIDENTAIS, INDIRETOS OU CONSEQUENCIAIS DE QUALQUER NATUREZA, OU QUAISQUER TIPOS DE DANOS. DETERMINADAS JURIDIÇÕES NÃO PERMITEM A EXCLUSÃO DE DETERMINADAS GARANTIAS OU DA LIMITAÇÃO OU EXCLUSÃO DE DETERMINADOS TIPOS DE DANOS. PORTANTO, DETERMINADAS LIMITAÇÕES DESTA SEÇÃO PODEM NÃO SE APLICAR A VOCÊ. NENHUMA DISPOSIÇÃO NESSES TERMOS DEVERÁ AFETAR QUALQUER DIREITO LEGAL QUE LHE ASSISTA. Se qualquer disposição ou disposições desses Termos de uso forem consideradas inválidas, ilegais ou não aplicáveis, a validade, legalidade e aplicabilidade das demais disposições devem permanecer em pleno vigor.

 

Propriedade intelectual
 

Direitos autorais. O serviço do Aplicativo, incluindo todo o conteúdo original, interface e demais conteúdos fornecidos, é protegido por direitos autorais, segredos comerciais e outras leis e tratados de propriedade intelectual, sendo todos de propriedade da Cafeinapp e/ou de parceiros comerciais da Cafeinapp.

Alegações de infração de direitos autorais. Se você acredita que seu trabalho foi reproduzido ou distribuído de forma que constitui infração de direitos autorais ou se você tem conhecimento de material que infrinja as leis de direitos autorais por meio do serviço do Aplicativo, notifique-nos pelo contato@cafeinapp.com.br.

 

Legislação vigente
 

Se você é residente do Brasil, esses Termos de uso devem ser regidos por e interpretados de acordo com a legislação do Brasil.

Você também pode ter direito a determinados direitos de proteção ao consumidor sob a legislação de sua jurisdição local, as quais são aplicáveis aqui em conformidade com a legislação brasileira.

 

Sobre Suporte
 

Quaisquer dúvidas em relação às informações aqui contidas, ou sobre o Aplicativo em si ou ainda, qualquer inconformidade no funcionamento do Aplicativo, podem ser enviadas através do e-mail contato@cafeinapp.com.br ou através da opção “Fale com a gente” disponível no Aplicativo.

 

Legislação e Foro
 

Estes Termos de Uso serão regidos, interpretados e executados de acordo com as leis da República Federativa do Brasil, independentemente dos conflitos dessas leis com leis de outros estados ou países, sendo competente o Foro da Comarca do Rio de Janeiro – Capital, Estado do Rio de Janeiro, Brasil, para dirimir qualquer dúvida ou litígio decorrente deste instrumento.

 

Contato
 

Caso seja necessário contatarmos você̂, que será́ realizado por meio do endereço de e-mail informado quando de seu cadastro no Aplicativo, ou por meio de mensagens disponibilizadas no próprio Aplicativo.

 

Em caso de dúvidas, sugestões ou reclamações, o Usuário pode contatar a Cafeinapp por meio de uma das seguintes modalidades:

E-mail: contato@cafeinapp.com.br;

Opção “Fale com a gente” disponível no Aplicativo.

 

Última atualização: setembro de 2022
`;
